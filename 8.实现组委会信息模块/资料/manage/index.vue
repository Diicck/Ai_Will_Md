<template>
  <!-- 管理页面的容器 -->
  <el-container class="manage-page">
    <el-container class="main">
      <!-- 侧边菜单区域 -->
      <el-aside class="menu">
        <ManageMenu />
      </el-aside>
      <!-- 主要内容区域 -->
      <el-main class="content">
        <!-- 内容容器，使用el-scrollbar来实现滚动条 -->
        <div class="content-container">
          <el-scrollbar height="100%">
            <!-- 路由视图，根据当前路由显示对应的组件 -->
            <router-view> </router-view>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script  setup>
import ManageMenu from "./components/menu.vue"; // 导入管理菜单组件
</script>

<style lang="scss" scoped>
.manage-page {
  /* 设置页面宽度和高度为视口的100% */
  width: 100vw;
  height: 100vh;
  /* 使用flex布局，并垂直居中子元素 */
  display: flex;
  align-items: center;
  /* 定义一些CSS变量，用于后续样式中 */
  --header-height: 80px;
  --menu-width: 240px;
  /* 设置背景渐变色 */
  background: linear-gradient(118deg, #1964d6 0%, #2894eb 40%, #36c3ff 101%);

  .el-container {
    /* 移除Element UI容器的默认边距 */
    margin: 0;
    padding: 0;
  }

  .el-header {
    /* 移除Element UI头部的默认边距 */
    margin: 0;
    padding: 0;
  }

  .el-aside {
    /* 移除Element UI侧边栏的默认边距 */
    margin: 0;
    padding: 0;
  }

  .el-main {
    /* 设置主容器的宽度和高度，减去头部高度 */
    margin: 0;
    padding: 0;
  }

  .header {
    width: 100%;
    height: var(--header-height);
  }

  .main {
    width: 100%;
    height: calc(100% - var(--header-height));
    display: flex;
    padding-left: 24px;
    padding-right: 40px;

    .menu {
      width: var(--menu-width);
      height: 100%;
    }

    .content {
      /* 设置内容区域的宽度和高度，以及圆角 */
      border-radius: 25px;
      width: calc(100% - var(--menu-width));
      height: 100%;
      background: #5755e3;

      .content-container {
        width: 100%;
        height: 100%;
        border-radius: 20px 0px 0px 0px;
        background-color: #fff;
      }
    }
  }
}
</style>