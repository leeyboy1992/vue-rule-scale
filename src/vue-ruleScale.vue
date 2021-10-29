<template>
    <div class='rule-view' v-if="isShow">
        <div class="rule-overlay" style="z-index: 2013;" @click="isShow = false"></div>
        <div class="rule-popup rule-popup--bottom" style="height: 30%; z-index: 2014;">
            <div class="rule-picker__toolbar van_picker_1">
                <button type="button" class="rule-picker__cancel" @click="cancelHandle">取消</button>
                <div class="rule-ellipsis rule-picker__title">{{title}}</div>
                <button type="button" class="rule-picker__confirm" @click="confirmHandle">确认</button>
            </div>
            <div class='textContent'>
                <p>{{unit=='kg' ? stateNums.toFixed(1):stateNums}}{{unit}}</p>
            </div>
            <div class="rule-content" id="touchModule">    
                <div class='arrow-icon'>
                    <div class='arrow-up'></div>
                    <div class='line'></div>
                </div>
                <div class='module' id="transModule" :data-x="startTransLateX" :style="{transform: 'translateX('+startTransLateX + 'px)'}">
                    <div class='module_in' id="moduleIn">
                        <div class='li'>
                            <div class="text"></div>
                            <div class='spanBox'>
                                <span v-for="item in 10" :key="item" class='span'></span>
                            </div>
                        </div>
                        <div class='li' v-for="(item,index) in diffLength + 1 " :key="index">
                            <div class="text" v-if="unit == 'cm'">{{(index * 10) + minNums }}</div>
                            <div class="text" v-if="unit == 'kg'" style="left:-15px">{{(index  + minNums).toFixed(1)}}</div>
                            <div class='spanBox'>
                                <span class='span' v-if="item >= diffLength + 1"></span>
                                <span v-for="item in 10" :key="item" class='span' v-else></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props: {
        title: {
            type: String,
            default: () => {
                return '选择身高'
            }
        },
        value: {
            type: Boolean,
            default: ()=> {
                return false
            }
        },
        //最小值
        minNum: {
            type: Number,
            default:()=>{
                return 0;
            }
        },
        //最大值
        maxNum: {
            type: Number,
            default:()=>{
                return 180
            }
        },
        //三角形位置
        defaultNum: {
            type:Number,
            default:()=>{
                return 0
            }
        },
        //初始值
        stateNum: {
            type:Number,
            default:()=>{
                return 0
            } 
        },
        //单位
        unit: {
            type: String,
            default:()=>{
                return 'cm'
            } 
        }
    },
    data(){
        return {
            ruleNum: 8,//刻度间的距离
            stateNums: 0,//num 初始值
            startTime: 0,//开始时间
            endTime: 0,//结束时间
            speed: 0,//步数
            transLate: 0,
            isShow: false
        }
    },
    computed:{
        diffLength(){
            //除以10 150 - 20 = 130; 为了遍历模块
            let num = this.unit=='kg' ? this.maxNum - this.minNums : (this.maxNum - this.minNums) / 10;
            return num;
        },
        startTransLateX(){
            if((this.defaultNum - 10) <= 0){
                return 0
            }else{
                let num = (this.maxNum - (this.maxNum - this.minNums)) * this.ruleNum;
                if(this.unit == 'cm'){
                     return -(this.defaultNum  * this.ruleNum - num);
                }else{
                    return -((this.defaultNum - this.minNum )*10*this.ruleNum)
                }
            }
        },
        minNums:{
            get() {
                if(this.minNum - 10 < 0){
                    return 0;
                }else{
                    return this.minNum - 10;
                }
            },
            set(val) {
                // console.log('set');
            }
           
        }
    },
    watch: {
        value: {
            handler(val){
                this.isShow = val
            },
            immediate: true
        },
        isShow(val) {
            this.$emit('input',val)
        }
    },
    created(){

    },
    methods:{
       touchstarts(){
            if(this.isShow){
                this.stateNums = this.stateNum;
            }
           let touchModule = document.getElementById('touchModule');
           let transModule = document.getElementById('transModule');
           let querySelestor = document.querySelectorAll('.module_in .li')
           let liWidth = querySelestor[0].offsetWidth;//刻度之间的距离
           let moduleWidth = liWidth * querySelestor.length; //刻度的总长度
           let boundaryValue = moduleWidth - (liWidth * 2);//临界值
           let diffNum = (this.maxNum - (this.maxNum - this.minNums)); 
           let startX = 0;//起始点
           let diffX = 0;//差值
           let nowX = 0;
           let endX,beginX;//结束点

           //开始触摸时
           touchModule.addEventListener('touchstart',event =>{
               beginX = Number(transModule.getAttribute('data-x'));
               startX = event.changedTouches[0].clientX;
               this.startTime = Date.now();
           })

           //滑动时
           touchModule.addEventListener('touchmove',event =>{
               nowX = event.changedTouches[0].clientX;
               diffX = nowX - startX;//差值
               endX = beginX + diffX;//接上上一次结束的值
               let lastEndX = (Math.floor(endX / this.ruleNum) ) * this.ruleNum;
               //判断是否超出临界值
               if(lastEndX <= 0 && Math.abs(lastEndX) <= boundaryValue){
                    if(this.unit=='kg'){
                        this.stateNums = -(lastEndX - this.minNum*(10*this.ruleNum)) / (this.ruleNum*10);
                        console.log(this.stateNums,'this.stateNums')
                    }else{
                        this.stateNums = -(lastEndX / this.ruleNum)+ diffNum;
                    }
               }
               transModule.style = "transform: translateX(" + endX + "px)";
               transModule.setAttribute('data-x',endX);
           })
           
           //滑动结束
           touchModule.addEventListener('touchend',event =>{
               this.endTime = Date.now() - this.startTime;
               let distanceX = event.changedTouches[0].clientX - startX;
               this.speed = (distanceX / this.endTime) * 100;
               endX +=  this.speed;
               let target = endX > 0 ? 0 : endX < -(boundaryValue) ? -(boundaryValue) : endX;//临界值
               let endTarget = (Math.floor(target / this.ruleNum) ) * this.ruleNum;
                //判断是否超出临界值
                if(endTarget <= 0 && Math.abs(endTarget) <= boundaryValue){
                    if(this.unit=='kg'){
                        this.stateNums = -(endTarget - this.minNum*(10*this.ruleNum)) / (this.ruleNum*10);
                    }else{
                        this.stateNums = -(endTarget / this.ruleNum) + diffNum;
                    }
                }
               transModule.style = "transition:transform 500ms cubic-bezier(0.1, 0.57, 0.1, 1);transform: translateX(" + endTarget + "px)";
               transModule.setAttribute('data-x',endTarget);

           })
           
       },
       confirmHandle(){
           this.$emit('confirmCallback',{stateNum:this.stateNums,unit:this.unit})
       },
        cancelHandle(){
            this.isShow = false;
            this.$emit('cancelHandle')
        }

    },
    mounted(){
        // this.touchstarts()
        //获取不到节点,需要自己手动触发子组件this.touchstarts()方法;
        
    }
}
</script>
<style>
    body {
        margin:0;
        padding:0;
    }
    .rule-picker__toolbar {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        height: 44px;
    }
    .rule-picker__cancel {
        color: #969799;
    }
    .rule-picker__title {
        max-width: 50%;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        text-align: center;
    }
    .rule-ellipsis {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .rule-picker__cancel, .rule-picker__confirm {
        height: 100%;
        padding: 0 16px;
        font-size: 14px;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
    .rule-popup--bottom {
        bottom: 0;
        left: 0;
        width: 100%;
    }
    .rule-popup {
        position: fixed;
        max-height: 100%;
        overflow-y: auto;
        background-color: #fff;
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        -webkit-overflow-scrolling: touch;
    }
    .rule-overlay {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
    }
    .rule-content {
        margin: 0 auto;
        width: 330px;
         /* width: 6.6rem; */
        overflow: hidden;
        /* height: 200px; */
    }
    
    .rule-content .arrow-icon {
        position: relative;
        left:-2px;
        /* // left:0px; */
        top:2px;
        width: 14px;
        margin: 0 auto;
    }
    
    .rule-content .arrow-icon {
        position: relative;
        left:-2px;
        /* // left:0px; */
        top:2px;
        width: 14px;
        margin: 0 auto;
    }
    .rule-content .arrow-up {
        width: 0;
        height: 0;
        margin: 0 auto;
        z-index: 199;
        border-top: 12px solid #29C694;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
    }
    .rule-content .line {
        position: absolute;
        width: 2px;
        /* // height: pxTorem(77px); */
        height: 37px;
        background: #29C694;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
    }
    
    .rule-content.line {
        position: absolute;
        width: 2px;
        /* // height: pxTorem(77px); */
        height: 37px;
        background: #29C694;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
    }
    .rule-content .module {
        margin-top: 16px;
        height: 10vh;
    }
    .rule-content  .module .module_in {
         display: flex;
        transform: translateX(82px); 
    }
    .rule-content  .module .module_in .li:first-child {
         color:#fff;
    }
    .rule-content  .module .module_in .li:first-child .spanBox{
        color:#fff;
        border-bottom: 1px solid #fff;
    }
    .rule-content  .module .module_in .li:first-child .spanBox span {
        background: transparent;
    }
    .rule-content  .module .module_in .li:last-child .spanBox span {
         margin-right: 0;
    }
    .rule-content  .module .li {
        position: relative;
    }
    .rule-content  .module .li .spanBox {
        display: flex;
        align-items: flex-end;
        border-bottom:1px solid #979797;
    }
    .rule-content  .module .li .text {
        font-size: 16px;
        position: absolute;
        left:-8px;
        top: 30px;
        color:#979797;
    }
    .rule-content  .module span {
        width: 1px;
        height: 9px;
        background: #979797;
        margin-right:7px; 
    }
    .rule-content  .module .span:nth-of-type(1) {
        height: 21px;
    }
    .rule-content  .module .span:nth-of-type(6) {
        height: 13px;
    }
</style>

