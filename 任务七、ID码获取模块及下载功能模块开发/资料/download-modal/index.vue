<template>
  <!-- 使用 Element UI 的对话框组件展示下载专区表单 -->
  <el-dialog v-model="dialog_visible" title="下载专区" width="512px">
    <!-- 一级 -->
    <el-form :model="form" label-width="120px" size="large">
      <!-- 下载链接输入项 -->
      <el-form-item label="下载链接" required>
        <el-input v-model="link" type="textarea" placeholder="请输入下载链接" />
      </el-form-item>
      <!-- 操作按钮项 -->
      <el-form-item label="">
        <el-button
          type="primary"
          @click="handleSubmit"
          v-if="userStore.info_data.role == 'organizing'"
          >确定修改</el-button
        >
        <el-button type="primary" @click="handleJumpLink" v-else
          >点击跳转</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup >
// 导入 Vue 的 Composition API
import { onMounted, ref } from "vue";
// 导入用户状态管理
import { useUserStore } from "@/store/user";
// 使用 Element Plus 的消息提示组件
import { ElMessage } from "element-plus";
// 导入 API 调用函数
import { getSysConfig, updateSysConfig } from "@/api/manage/index.js";

// 获取用户状态
const userStore = useUserStore();
// 控制对话框显示的响应式引用
const dialog_visible = ref(false);
// 存储下载链接的响应式引用
const link = ref("");
// 存储配置项ID的响应式引用
const id = ref("");

// 打开对话框的函数
const handleOpenModal = () => {
  dialog_visible.value = true;
};
// 获取配置
const handlegetSysConfig = async () => {
  let res = await getSysConfig();
  if (res.success) {
    link.value = res.entity.content;
    id.value = res.entity.id;
  }
};
// 提交接口
const handleSubmit = async () => {
  // TODO 判断连接是否正确
  let res = await updateSysConfig({
    id: id.value,
    content: link.value,
  });
  if (res.success) {
    ElMessage.success(res.message);
  }
  dialog_visible.value = false;
};
// 跳转到链接
const handleJumpLink = () => {
  window.open(link.value);
};

// 暴露方法给父组件调用
defineExpose({
  handleOpenModal,
});

// 组件挂载后获取系统配置
onMounted(() => {
  handlegetSysConfig();
});
</script>
<style lang="scss" scoped></style>