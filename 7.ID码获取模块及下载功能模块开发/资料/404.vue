<template>
  <!-- 使用 Element Plus 的 Result 组件来展示一个 404 页面不存在的结果提示 -->
  <el-result icon="warning" title="404" sub-title="页面不存在">
    <!-- 使用插槽 extra 来添加额外的内容，如按钮 -->
    <template #extra>
      <el-button type="primary" @click="handleBackHome">返回首页</el-button>
    </template>
  </el-result>
</template>

<script setup>
// 使用 Vue 的 Composition API 来定义一个返回首页的方法
const handleBackHome = () => {
  // 设置浏览器的当前地址为根目录（"/"），从而返回首页
  location.href = "/";
};
</script>
