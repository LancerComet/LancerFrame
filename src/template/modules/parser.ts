import { ASTNode } from './ast'
import { NodeType } from '../../core/config'
import { isDirective, isValueDirective, getDecorators } from '../../directives'

/**
 * Convert html string to AST.
 *
 * @param {string} htmlString
 * @param {$ComponentUsage} $components
 * @returns {AST}
 */
function parseHTMLtoAST (htmlString: string, $components: $ComponentUsage): AST {
  if (!htmlString) {
    return []
  }

  const ast: AST = []

  // Generate elements and convert to AST.
  const $el = document.createElement('div')
  $el.innerHTML = htmlString

  if ($el.childElementCount > 1) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${process.env.NAME}] Component only accepts one root element, please wrap your all nodes into a single element.`)
    }
    return []
  }

  for (let i = 0, length = $el.childNodes.length; i < length; i++) {
    const currentNode = $el.childNodes[i]
    ast.push(
      elementToASTNode(currentNode, $components)
    )
  }

  return ast
}

export {
  parseHTMLtoAST
}

/**
 * Convert single HTML node to ASTNode.
 *
 * @param {Node} node
 * @param {$ComponentUsage} [$components]
 * @param {ASTNode} [parentNode]
 * @returns {ASTNode}
 */
function elementToASTNode (node: Node, $components?: $ComponentUsage, parentNode?: ASTNode): ASTNode {
  let attributes: ASTNodeElementAttribute = {}
  const children: AST = []
  let ComponentCtor = null
  let expression: string = ''
  let isComponentAnchor: boolean = false
  let isSlotAnchor: boolean = false
  let nodeType: number = node.nodeType
  let props: {} = {}
  let tagName: string = ''
  let textContent: string = null

  switch (nodeType) {
    // Element.
    case NodeType.element:
      const tagNameInLowerCase = (<HTMLElement> node).tagName.toLowerCase()

      // Reserved element, such as "slot".
      switch (tagNameInLowerCase) {
        case 'slot':
          isSlotAnchor = true
          break

        case 'transition':
          break
      }

      // If component usage is given then check if this node is an anchor for component.
      if ($components && $components[tagNameInLowerCase]) {
        // This is a component anchor.
        isComponentAnchor = true
        ComponentCtor = $components[tagNameInLowerCase].Constructor
        nodeType = NodeType.comment  // Over NodeType to NODE_TYPE.comment.
      }

      // Get attributes info.
      Array.prototype.slice.call(node.attributes)
        .forEach(item => {
          const attrName = item.name

          // Save this attribute as a prop.
          if (isComponentAnchor && isValueDirective(attrName)) {
            props[attrName] = item.value

          // Save as an attribute.
          } else {
            let attrNameWithoutDecorators = attrName
            let decorators = []

            // If this is a directive, get both attribute name which is without decorators
            // and decorators.
            if (isDirective(attrName)) {
              attrNameWithoutDecorators = (attrName.match(/\W\w+\b/) || [])[0] || attrName
              decorators = getDecorators(attrName)
            }

            attributes[attrNameWithoutDecorators] = {
              value: item.value,
              decorators
            }
          }
        })

      tagName = tagNameInLowerCase
      break

    // TextNode.
    case NodeType.textNode:
      expression = textContent = node.textContent || node.nodeValue || ''
      break
  }

  const astNode = new ASTNode({
    attributes,
    children,
    ComponentCtor,
    expression,
    isComponentAnchor,
    isSlotAnchor,
    nodeType,
    parentNode,
    props,
    tagName,
    textContent
  })

  // Deal with children.
  const childrenLength = node.childNodes.length
  if (nodeType === NodeType.element && childrenLength) {
    let i = 0
    while (i < childrenLength){
      const childNode = node.childNodes[i]
      children.push(elementToASTNode(childNode, $components, astNode))
      i++
    }
  }

  return astNode
}
