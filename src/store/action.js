
import User from "@/api/modules/user";
import preApi from "@/api/modules/permission";
import Publics from "@/api/modules/public.js";
// #ifdef H5
import { dataURLtoFile } from "@/utils/utils";
// #endif
export default {
	
	initUserInfo({ dispatch,commit, state },{token}){
		let skip=token?false:true;
		// 获取用户信息
		token = token||uni.getStorageSync("user_token");
		if (token) {
			User.getUserByToken({
				token
			}).then(data => {
				dispatch("setUserInfo", data);
				if(skip){
					uni.switchTab({
						url:`/pages/statistics/statistics`
					});
				}
			}).catch(e => {
				uni.removeStorageSync('user_token');
			});
		}
	},
	
	/**
	 * 存入用户信息和菜单权限
	 */
	setUserInfo({ commit, state }, userInfo) {
		commit("setUserInfo", userInfo);
		preApi.getQueryMethodTree().then(data => {
			commit("setMethodTree", data);
		}).catch(err => {
			uni.showToast({
				title: typeof err == "string" ? err : JSON.stringify(err),
				duration: 2000,
				icon: "none"
			});
		});
	},

	setUploadImage({ commit }, path) {
		let _this = this;
		return new Promise((resolve) => {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: function (res) {
					uni.showLoading({
						title: '上传中....'
					});
					// #ifdef H5
					let zoom = res.tempFiles[0].size >= 1024 * 1024 * 2 ? 0.3 : 1;
					let canvas = document.createElement('canvas');
					let ctx = canvas.getContext('2d');
					let img = new Image();
					img.setAttribute('crossOrigin', 'anonymous');
					img.src = res.tempFilePaths[0];
					img.onload = function () {
						canvas.width = Math.round(img.width * zoom);
						canvas.height = Math.round(img.height * zoom);
						ctx.drawImage(img, 0, 0, Math.round(img.width * zoom), Math.round(img.height * zoom));
						let base64Str = canvas.toDataURL('image/jpeg', zoom == 0.3 ? 0.7 : 1);
						let files = dataURLtoFile(base64Str, "filename.jpg");
						var xhr = new XMLHttpRequest();
						var formData = new FormData();
						formData.append("file", files);
						formData.append("uploadType", "1");
						formData.append("token", _this.state.userInfo ? _this.state.userInfo.token : "");
						formData.append("path", path);
						xhr.open('POST', Publics.upload());
						xhr.send(formData);
						xhr.onreadystatechange = function () {
							if (xhr.readyState == 4 && xhr.status == 200) {
								resolve(JSON.parse(xhr.response).data.url);
								uni.hideLoading();
							}
							else {
								uni.hideLoading();
							}
						}
					}
					// #endif
					// #ifdef MP-WEIXIN
					if (res.tempFiles[0].size >= 1024 * 1024 * 2) {
						uni.showToast({
							title: "图片必须小于2M",
							icon: "none",
							duration: 2000
						});
						return;
					}
					uni.uploadFile({
						url: Publics.upload(),
						filePath: res.tempFilePaths[0],
						name: 'file',
						formData: {
							file: "test",
							uploadType: '1',
							token: _this.state.userInfo ? _this.state.userInfo.token : "",
							path: path
						},
						success(res) {
							resolve(JSON.parse(res.data).data.url);
							uni.hideLoading();
						}
					})
					// #endif
				}
			});
		})
	}



}