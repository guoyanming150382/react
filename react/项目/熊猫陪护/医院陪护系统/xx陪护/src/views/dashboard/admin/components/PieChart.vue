<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { hospitalStat,departStat } from '@/api/stat'
import { debounce } from '@/utils'

const labelTop = {
    show : true,
    position : 'center',
    formatter : function (params){
        return  "("+params.value+"/"+params.data.total+")\n\n"+params.seriesName+"\n\n"
    },
    textStyle: {
        baseline : 'middle'
    }
}
const labelFromatter ={
    formatter : function (params){
        return  '\n\n'+ ((params.data.total-params.value)*100/(params.data.total*1.0)).toFixed(1) + '%'
    },
    textStyle: {
        baseline : 'bottom'
    }
}

const labelBottom = {
    show : true,
    position : 'center'  
}
var radius = [55, 70];

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    type: {
      type: String,
      default: 'hospital'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      option: {},
      chart: null
    }
  },
  mounted() {
    this.initChart()
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initStat(){
        let vm = this
        hospitalStat({}).then(response => {
            vm.option.title.text = "陪护床使用情况 ( 使用中:" + response.result.inUseBed +  "张  总投放:" + response.result.totalBed + "张 )";
            //vm.option.title.subtext = response.result.inUseBed + "/" + response.result.totalBed
            response.result.list.forEach(function(item, index, arr){
                var center = [] ;
                var data = [] ;
                center.push(10+(index%5) *20+"%")
                center.push(30+parseInt(index/5) *40+"%")
                data.push({
                    type:"hospital",
                    name:'使用中',
                    value: item.bedInUse,
                    label : labelTop,
                    total : item.totalBed
                })
                data.push({
                    type:"hospital",
                    name:'未使用',
                    value: item.totalBed - item.bedInUse,
                    label : labelBottom,
                    total : item.totalBed
                })
                vm.option.series.push(vm.assembleItem(item.hospitalId,item.hospitalName,center,data))
            
                }, this)
            //vm.option.series = vm.series;
            vm.option.toolbox.feature.myBack.show=false
            vm.chart.setOption(vm.option,true)
        })  
    },
    initChart() {
        let vm = this
        this.chart = echarts.init(this.$el, 'macarons')
        this.option = {
            legend: {
                x : 'left',
                y : 'top',
                data:['使用中','未使用']
            },
            title : {
                //text: this.title,
                //subtext: '总体情况：'+ this.detail,
                x: 'center'
            },
            tooltip : {
                trigger: 'item',
                formatter : "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                feature : {
                    myBack: {  
                        show: true,  
                        title: '返回',  
                        icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEpElEQVRoQ+2YbWxTZRTH/+e23epSiaLZB3zJDJtbb30JUtmtRJGZgK+BRGMgmhj4QjDyBdpuRhObaAR320FQEiOJr1FRBkaNQYwREyW9czKi8blbJiao6KKggTGm29p7zB0Z3Na1vd3t1jVZv97n/M//95zzvPQhVPiPKtw/5gDKXcG5ClR8BVq/DVybTnGCmJaB0KEqYttMQjlqoYjmbwDTlyBaMGHaAAIJRegzBTFlgLDWeBPB9QVAV1jNGpx+MBHq2z+rAaKaXzFABwk0L9Mof6Qq+qqZMm/mKboC0W/ku4w0fUyES6xGmbF/0ONd80rwyNisBQhr8iqA9hLgyTL/RlwR60DgmTRfVAWiSfkRJrwJkJRpnl+Kh/RNM218Ip+tFook/RuZaBeBMscTP6U268+Xy7ytCoS75GeIKZYx62AG04Z4SOwup/n8AAyKaPIuEG3MNsnAbnD6namYJ5e5TlxnRg0auLz5h5MxgjEVnYItFNECzwJ42om4jdhhZj4ICZ0j80f3vdhwbMRGTMaQnGsgnAwMZ2+VxYoXM56ZfwZxW1zp3VNMXE6AiBboBhAsRqwUY5n5QJrp0e23ib/t6OUE2KIFZGIcIkLt/4SYewA6ayfBpGMICwFcnSueGb8ZEu7raBbfFcqRdxttSzbVpUk6BFBd1t5/NOUdbtmx6PjpQglyfY/2NC7AmLSEmR4AaP0kG8WvnqqRxVtvOXYyX46C50D48MJakryfg3BjJgT6Uh6jZUewd2CqEBNx4WTTnQTpbeut1vzGjO5Bj3dpvutJQQBTKPp146Xsch8AYWmW2RMuTt++LdR33CnEeA63uxPACqsWgcPtip7IpW8LwAze9GN9tfdUdScI92dV4k/2jC1LBPv7nEKY1YZU3UtE8ye0zPXg+1fUxZYjNZm+bQAzOMaQhrTAq0R4LAMCOG24uKXjVv2oU4hol381s/RBho6Ee9Ql4lPHABMCEU3eClBbFsQ5YqxUQ+KwU4iIJvcD1HBBh7FdDYnNJQMwhcJd8hNg7LRe8Jh5KOUdvsbJ7jSurckvE2jDRcP8larod5QU4Hwi/xpi6S0Q3JbZWqeGxOtOqhBOyg8T0XsWzZ/UkKgvOYApGNGaVjBL+4jIB+bfucZ9ffzm7885AjC3bpf3D8tC/iceEjXTAmCKmgfeGNG9cKffTwT7Tzkxf35S/A2A1G9pob9URb9y2gCcGs6OH29NSO9aAISq6DdUEIDcTqDIhRYC9sQVsbYiAB4XAV/NIPqIcNVFAF4fV/TXKgIgkpR3gijjkcBdNVKb61JX1Elc6l7P1tvcLS+S0jiScbaAP4wr+upcuWcNwBataTFB2kug6yy9P+Zyo/6FoPhl1gLERKBq6CzHCGjNfnMCG61qqLc9X+XLUoHxf3vELTBoOQgtBFw2icnPVEWsLNS2ef5Syg9JoOcANBYSKfV3BnelqofvtnOnyv0qocmCQHKpzRXSMx+JffOwNhYQo4XGmt9nDYD5rEISPak2C8sJXBihXC10hhkDAJ8gUA9LhubzSZ/YnXUrVlkWceF5tT9iDsD+XE3PyLkKTM+82let+Ar8B+OdnECbGStCAAAAAElFTkSuQmCC',  
                        onclick: function (){  
                            vm.initChart() 
                        }  
                    }, 
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['pie', 'chordChart']},
                    //restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : []
        },
        this.chart.on('click', function (params) {
            console.log("params",params)
            if(params.data.type === 'hospital' ){
                vm.initDepartStat(params.seriesId,params.seriesName);
            }else if(params.data.type === 'depart'){
                vm.$router.push({ path: "/bed/list" || '/' })
            }else{

            }
        });
        this.initStat();
    },
    initDepartStat(hospitalId,hospitalName){
        let vm = this
        departStat({"hospitalId":hospitalId}).then(response => {
            vm.option.title.text = hospitalName+"-使用概览";
            //vm.option.title.subtext = response.result.inUseBed + "/" + response.result.totalBed
            vm.option.series.splice(0,vm.option.series.length);
            response.result.list.forEach(function(item, index, arr){
                var center = [] ;
                var data = [] ;
                center.push(10+(index%5) *20+"%")
                center.push(30+parseInt(index/5) *40+"%")
                data.push({
                    type:"depart",
                    name:'使用中',
                    value: item.bedInUse,
                    label : labelTop,
                    total : item.totalBed
                })
                data.push({
                    type:"depart",
                    name:'未使用',
                    value: item.totalBed - item.bedInUse,
                    label : labelBottom,
                    total : item.totalBed
                })
                vm.option.series.push(vm.assembleItem(item.departmentId,item.department,center,data))
            
            }, this)
            vm.option.toolbox.feature.myBack.show=true
            vm.chart.setOption(vm.option,true)
        }) 
    },
    assembleItem(id,name,center,data){
      return {
        id:id,  
        type : 'pie',
        name : name,
        center : center,
        radius : radius,
        x: '0%', // for funnel
        label : labelFromatter,
        data : data
      }
    },
  }
}
</script>
