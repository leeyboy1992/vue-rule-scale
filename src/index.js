import ruleScale from './vue-ruleScale.vue'
export default ruleScale

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.component('vue-ruleScale', ruleScale)
}