/// <reference path="./ast.d.ts" />

import { NodeType } from './config'
import { createDirective, directives, isDirective } from '../directives'
import { nextTick, randomID } from '../utils'

/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  id: string
  attributes: ASTNodeElementAttribute
  children: AST
  ComponentCtor: (new () => LC)
  directives: Directive[]
  element: Element | Text | Comment
  expression: string
  isComponentAnchor: boolean
  isSlotAnchor: boolean
  nodeType: ASTNodeType
  parentNode: ASTNode
  props: ASTNodeProps
  tagName: string
  textContent: string

  /**
   * Create HTML element.
   *
   * @memberof ASTNode
   */
  createElement () {
    let element: Element | Text | Comment = null

    switch (this.nodeType) {
      // Component anchor or html element.
      case NodeType.element:
        element = document.createElement(this.tagName)

        // Add data-style for style scoping.
        // Use parent's id if it has a parent.
        element.setAttribute('data-style-' + getAncestorID(this), '')

        // Set attributes.
        const attrNames = Object.keys(this.attributes)
        for (let i = 0, length = attrNames.length; i < length; i++) {
          const attrName = attrNames[i]
          const { value: attrValue } = this.attributes[attrName]

          // If this attribute is a directive.
          if (isDirective(attrName)) {
            // Get Directive Constructor if this directive has been defined.
            let DirectiveCtor = directives[attrName]

            // A non-internal directive, create a directive for this one.
            if (!DirectiveCtor) {
              DirectiveCtor = createDirective({
                name: attrName
              })
            }

            // Create a directive object and let it to do all jobs such as compiling, updating, etc.
            const directive = new DirectiveCtor(this, element, attrValue)
            nextTick(() => directive.install())
            this.directives.push(directive)
            continue
          }

          // A normal html attribute.
          element.setAttribute(attrName, attrValue)
        }

        break

      // TextNode.
      case NodeType.textNode:
        element = document.createTextNode(this.textContent)
        break

      // Comment.
      // This might be a component anchor.
      case NodeType.comment:
        element = document.createComment('')
        break
    }

    this.element = element
  }

  /**
   * Function to update element.
   * If a specific expression is given, update this expression only.
   *
   * @param {LC} component All models in component.
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @memberof ASTNode
   */
  updateExec (component: LC, specificExpression?: string, newValue?: any) {
    const variables = Object.keys(component)
    // const values = variables.map(item => component[item])
    const values = []
    for (let i = 0, length = variables.length; i < length; i++) {
      values[i] = component[variables[i]]
    }

    // Element type.
    // ========================
    if (this.nodeType === NodeType.element) {
      // Element only needs to update all directives.
      for (let i = 0, length = this.directives.length; i < length; i++) {
        const directive = this.directives[i]
        const expression = directive.expression  // 'font-size:' +  size + 'px'

        if (
          specificExpression &&
          !expression.match(new RegExp('\\b' + specificExpression + '\\b'))
        ) {
          continue
        }

        const value = typeof newValue !== 'undefined'
          ? newValue
          : evaluateExpression(variables, values, expression)

        directive.update(value, component)
      }

      return
    }

    // TextNode type.
    // ========================

    // Update textContent.
    const expressions = matchExpression(this.expression)

    // No expression, go return.
    if (!expressions) {
      return
    }

    const pureExpressions = expressions.map(getPureExpression)

    // If specific expression is given, check if "expressions" contains this one.
    let doUpdate = false
    if (specificExpression) {
      pureExpressions.some(item => {
        if (item.match(new RegExp(specificExpression))) {
          doUpdate = true
          return doUpdate
        }
      })
    } else {
      doUpdate = true
    }

    if (!doUpdate) {
      return
    }

    let newTextContent = this.expression

    expressions.forEach((exp, index) => {
      // If specific expression and vaule is given, override newValue to original value.
      if (exp.indexOf(specificExpression) > -1 && typeof newValue !== 'undefined') {
        const expIndex = variables.indexOf(specificExpression)
        if (expIndex > -1) {
          values[expIndex] = newValue
        }
      }

      // Replace mastache expression.
      const pureExpression = pureExpressions[index]
      newTextContent = newTextContent.replace(
        exp,
        evaluateExpression(variables, values, pureExpression)  // Evaluate new value.
      )
    })

    nextTick(() => {
      this.textContent = newTextContent
      this.element.textContent = newTextContent
    })
  }

  /**
   * Set all expressions' value.
   *
   * @param {LC} component
   * @memberof ASTNode
   */
  updateElement (component: LC) {
    this.updateExec(component)

    // Update children too.
    this.children.forEach(child => child.updateElement(component))
  }

  constructor (params: IASTNodeOption) {
    this.id = randomID()
    this.attributes = params.attributes || {}
    this.directives = []
    this.children = params.children || []
    this.expression = params.expression.trim() || ''
    this.isComponentAnchor = !!params.isComponentAnchor
    this.isSlotAnchor = !!params.isSlotAnchor
    this.parentNode = params.parentNode
    this.nodeType = params.nodeType || NodeType.element
    this.tagName = params.tagName

    switch (params.nodeType) {
      case NodeType.textNode:
        this.textContent = params.textContent || ''
        this.tagName = ''  // Override tagName to empty.
        break

      case NodeType.element:
        break

      case NodeType.comment:
        this.ComponentCtor = params.ComponentCtor || null
        this.props = params.props || {}
        break
    }

    this.createElement()
  }
}

export {
  ASTNode
}

/**
 * Evaluate expression result.
 *
 * @param {string[]} variableName
 * @param {any[]} variableValue
 * @param {string} expression
 * @returns
 */
function evaluateExpression (variableName: string[], variableValue: any[], expression: string) {
  const evalFunc = Function.apply(
    null,
    variableName.concat('try { return ' + expression + '} catch (error) { return "" }')
  )
  const result = evalFunc.apply(null, variableValue)
  return result
}

/**
 * Match expression from any html string.
 *
 * @param {string} string
 * @returns
 */
function matchExpression (string: string) {
  return string.match(/{{(\w|\d)+}}|{.+}/g)
}

/**
 * Get pure expression by removing mastache.
 *
 * @param {string} expression
 * @returns {string}
 */
function getPureExpression (expression: string): string {
  return expression.replace(/{|}/g, '')
}

/**
 * Normalize operators for regexp.
 *
 * @param {string} regExpStr
 * @returns {string}
 * @example
 *  {{a * b}} => {{a \* b}}
 */
function normalizeOperators (regExpStr: string) {
  (regExpStr.match(/\+|\*/g) || []).forEach(item => {
    regExpStr = regExpStr.replace(item, '\\' + item)
  })

  return regExpStr
}

/**
 * Get ancestor's ID.
 *
 * @param {ASTNode} astNode
 * @returns
 */
function getAncestorID (astNode: ASTNode) {
  return astNode.parentNode
    ? getAncestorID(astNode.parentNode)
    : astNode.id
}