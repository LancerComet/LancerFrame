/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'

/**
 * Assign this class as a component.
 *
 * @param {IComponentOption} [option={}]
 * @returns
 */
function Component (option: IComponentOption = {}) {
  return function (ClassByUser: any) {

    // Create $components.
    const $components = {}
    if (option.components) {
      Object.keys(option.components).forEach(key => {
        $components[key] = {
          reference: null,
          Constructor: option.components[key]
        }
      })
    }

    // Create $template.
    const $template = typeof option.template === 'string'
      ? option.template
      : ''

    // Create $models.
    const $models = {}
    const instance = new ClassByUser()
    const keys = Object.keys(instance)

    // Get accessor's key.
    // const accessors = Object.getOwnPropertyNames(
    //   Object.getPrototypeOf(instance)
    // ).filter(key => key !== 'constructor')

    // keys = keys.concat(accessors)

    // TODO: Check vaild key name.

    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i]
      const value = instance[key]

      if (value === null || value === undefined) {
        console.error(`[${process.env.NAME}] You should provide an initial value for your model "${key}".`)
        continue
      }

      // Switch value type, method or model.
      // Methods.
      if (typeof value === 'function') {
        // TODO: deal with function.
        continue
      }

      $models[key] = new ReactiveModel(key, {
        type: value.constructor,
        default: value,
        $component: null  // Will be written in class LC.
      })
    }

    // Rewrite prototype for inheritance.
    ClassByUser.prototype = Object.assign(ClassByUser.prototype, <ILcBaseProperties> {
      $components,
      $template,
      $models
    })
  }
}

export {
  Component
}
