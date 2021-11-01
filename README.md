### rule
移动端刻度筛选 移动端身高体重筛选 刻度筛选
### How to use?
```bash
npm i vue-rule-scale
```

### Example

```vue
<template>
    <vue-rule-scale 
      v-model="isPopup" 
      ref="rule" 
      @confirmCallback="handlerSuccess" 
      @cancelHandle="handlerError"
      title="选择身高"
      :stateNum="50"
      :defaultNum="50"
      :minNum="0"
      :maxNum="200"
      unit="kg"
    />
</template>

<script>
  import vueRuleScale from 'vue-rule-scale'
  export default {
    components: { vueRuleScale },
    data () {
      return {
        isPopup: false 
      }
    },
    methods: {
        handlerSuccess(e) {
            console.log(e)
        }
    }
  }
</script>

```
![image text](https://gitee.com/null_826_5633/vue-rule-scale/raw/master/height.png)
![image text](https://gitee.com/null_826_5633/vue-rule-scale/raw/master/weight.png)

```js
// 弹窗显示的时候需要手动触发touchstarts方法
this.$nextTick(()=>{
    this.$refs.rule.touchstarts()
})
```


参数 | 描述 | 类型
---|---|---
v-model | 显示隐藏 | Boolean
title | 弹窗标题 | String
stateNum | 初始值 | 默认0（Number）
defaultNum | 三角形的位置 | 默认0（Number）
minNum | 最小值 | 默认0（Number）
maxNum | 最大值 | 默认180（Number）
unit | 单位 | 默认cm
confirmCallback | 确定回调（返回选中值和单位） | 类型Function
cancelHandle | 取消回调 | 类型Function



