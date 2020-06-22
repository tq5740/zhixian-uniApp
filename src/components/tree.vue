<template>
	<view class="tree">
		<template v-for="(v,i) of showList">
			<view class="tree-item" :class="{root:root,'root-first':root&&i==0, branch:!root,vertex:!(v.children&&v.children.length>0)}" :key="i">
				<template v-if="v.children&&v.children.length>0">
					<view class="title" :class="{'tree-item-choose':v.choose&!edit}">
						<text class="title-text uni-ellipsis" @tap="onShowChildren(v)">
							<text class="iconfont" :class="{iconshouqi:v.open,iconzhankai:!v.open}"></text>
							{{v.name}}
						</text>
						<text @tap="onItemChoose(v)" class="select iconfont"
						:class="{iconcaozuo:edit,iconxuanzhong:v.choose&!edit,iconweixuanzhong:!v.choose&!edit}"></text>
					</view>
					<template v-if="lazy">
						<tree :ref="v.value" :lazy="lazy" :class="{hidden:v.open!=true}" :edit="edit" @onTreeChoose="onChooseTree" @onBranchClick="onBranchClick"></tree>
					</template>
					<template v-else>
						<tree :ref="v.value" :lazy="lazy" :class="{hidden:v.open!=true}" :edit="edit" @onTreeChoose="onChooseTree" @onBranchClick="onBranchClick" :dataList="v.children"></tree>
					</template>
				</template>
				<template v-else>
					<view class="title" :class="{'tree-item-choose':v.choose&!edit}">
						<text class="title-text uni-ellipsis" >
							<text class="iconfont iconfenleizuihouyiji"></text>
							{{v.name}}
						</text>
						<text @tap="onItemChoose(v)" class="select iconfont" 
						:class="{iconcaozuo:edit,iconxuanzhong:v.choose&!edit,iconweixuanzhong:!v.choose&!edit}"></text>
					</view>
				</template>
			</view>
		</template>
	</view>
</template>

<script>
	function searchTree(source,txt,target){
		for (let v of source) {
			let obj=undefined,result=undefined;
			if(v.children&&v.children.length>0){
				result=searchTree(v.children,txt,[]);
			}
			if(v.name.indexOf(txt)!=-1||result){
				obj={...v};
				obj.open=true;
				obj.children=result?result:[];
				target.push(obj);//浅拷贝
			}
		}
		return target.length==0?undefined:target;
	}
	
	export default {
		props: {
			dataList: {
				type: Array,
				default(){return []},//必须包含value和name
			},
			root:{//是否是根节点
				type:Boolean,
				default:false
			},
			edit:{//是否是编辑
				type:Boolean,
				default:true
			},
			lazy:{//点击后渲染下级
				type:Boolean,
				default:false
			},
		},
		data() {
			return {
				showList:[],//只有将dataList放到data里，变动dataList元素属性时小程序才会进行视图响应
			};
		},
		watch:{
			dataList:{
				handler:function(newValue, oldValue) {
					// 初始化
					if(!this.showList||this.showList.length==0)
						this.showList=newValue;
					//dataList更新，如果要动态更新dataList，需要先置空dataList，然后延迟重置dataList(定时器、$nextTick)
					if(!newValue||newValue.length==0){
						this.showList=[];//重置showList,为datalist更新做准备
					}
				},
				immediate:true
			}
		},
		methods: {
			show(dataList,reset){
				if(reset||this.showList!=dataList){//引用地址比较
					this.updateShowList(dataList);
				}
			},
			updateShowList(list){
				this.showList=[];
				this.$nextTick(()=>{
					this.showList=list;
				});
				// this.showList=list;
			},
			search(value){
				//从dataList中筛选
				let list_=searchTree(this.dataList,value,[]);
				this.updateShowList(list_?list_:[]);
			},
			onShowChildren(item){
				this.$set(item,"open",item.open?false:true);
				if(item.open){
					// :dataList="v.children"
					// 展开时给showList赋值
					if(this.lazy)
						this.$refs[item.value][0].show(item.children);
				}
				this.$emit("onBranchClick",{
					open:item.open,
					item
				});
			},
			onBranchClick(options){
				this.$emit("onBranchClick",options);
			},
			onItemChoose(item){
				if(!this.edit){
					this.$set(item,"choose",item.choose?false:true);
					if(item.choose){
						this.$emit("onTreeChoose",item);
					}
				}else{
					this.$emit("onTreeChoose",item);
				}
				
			},
			onChooseTree(item){
				this.$emit("onTreeChoose",item);
			},
			getAllChoose(){
				let list=[];
				this._getAllChoose(this.showList,list);
				return list;
			},
			_getAllChoose(source,target=[]){
				for (let v of source) {
					if(v.choose){
						target.push(v)
					}
					if(v.children&&v.children.length>0)
						this._getAllChoose(v.children,target);
				}
			},
			resetChoose(){
				this.chooseNotAll(this.showList);
			},
			chooseNotAll(list){
				for (let v of list) {
					this.$set(v,"choose",false);
					if(v.children&&v.children.length>0)
						this.chooseNotAll(v.children);
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.hidden{display: none;}
	.tree{
		background: #FFFFFF;
		$border-color:#BBD1C7;
		&-item{
			position: relative;
			margin: 0upx 0px 0px 30upx;
			// margin: 40upx 0px 0px 30upx;
			color:#000;
			// &::before{
			// 	position: absolute;
			// 	content: "";
			// 	height: 100%;
			// 	border-left: 2upx dashed $border-color;
			// }
			&-choose{
				color: #457E64;
			}
		}
		.root-first{
			margin: 0upx 0px 0px 30upx;
		}
		
		.iconfont{margin-right: 15upx;font-size: $font-size-28;}
		.iconxuanzhong,.iconweixuanzhong{font-size: $font-size-36;}
		.select{
		padding: 20upx;
		}
		.root{
			font-size:  $font-size-28;
		}
		.branch{
			font-size: $font-size-28;
		}
		.vertex{
			color: $color-666;
		}
		.title{
			display:flex;align-items:center;justify-content: space-between;
			width: 100%;
			&-text{
				width: 450upx;
				flex-grow: 1;
			}
			// &::before{
			// 	content: "";
			// 	width: 30upx;
			// 	border-top: 2upx dashed $border-color;
			// }
		}
	}
</style>
