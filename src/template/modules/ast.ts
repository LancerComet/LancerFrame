/// <reference path="./ast.d.ts" />

/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  _id: string
  attributes: ASTNodeElementAttribute
  children: AST
  nodeType: ASTNodeType
  tagName: string
  textContent: string
  componentAnchor: boolean
  ComponentConstructor: new (...args) => any

  constructor (params: IASTNodeOption) {
    this._id = params._id
    this.attributes = params.attributes || {}
    this.children = params.children || []
    this.nodeType = params.nodeType || 1
    this.tagName = params.tagName
    this.textContent = params.textContent || null
    this.componentAnchor = params.componentAnchor || false
    this.ComponentConstructor = params.ComponentConstructor || null
  }
}

export {
  ASTNode
}
