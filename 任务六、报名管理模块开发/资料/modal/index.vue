<script setup>
// 导入Vue的Composition API中的ref、onMounted和onUnmounted函数
import { ref, onMounted, onUnmounted } from "vue";
// 导入自定义的事件绑定和解绑函数on和off，可能用于处理模态框的事件
import { on, off } from "@/utils/modal.js";
// 导入Lodash库，一个常用的JavaScript实用工具库
import _ from "lodash-es";

// 定义组件的props，用于接收外部传入的参数
const props = defineProps({
  modalName: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "",
  },
  submit: {
    default: () => {},
    type: Function,
  },
  type: {
    default: "dialog",
    type: String,
  },
});
// 定义组件可以发出的事件
const emit = defineEmits(["open", "opened", "close", "submit"]);
// 定义一个响应式变量modalShow，用于控制模态框的显示状态
const modalShow = ref(false);
// 定义一个响应式变量argData，用于存储传递给模态框的数据
const argData = ref();

// 在组件挂载时，绑定事件监听器
onMounted(() => {
  on(props.modalName, {
    open: (arg) => {
      console.log("open");
      modalShow.value = true;
      argData.value = arg;
    },
    close: (arg) => {
      console.log("close");
      modalShow.value = false;
    },
  });
});

// 定义一个方法，当模态框打开时触发
const handleModalOpen = () => {
  emit("open", _.cloneDeep(argData.value));
};

// 定义一个方法，当模态框完全打开时触发
const handleModalOpened = () => {
  emit("opened", _.cloneDeep(argData.value));
};

// 定义一个方法，当模态框关闭时触发
const handleModalClose = () => {
  emit("close", _.cloneDeep(argData.value));
};

// 在组件卸载时，移除事件监听器
onUnmounted(() => {
  off(props.modalName);
});
</script>

<template>
  <component
    :is="'el-' + props.type"
    v-if="props.modalName"
    v-model="modalShow"
    :width="props.width ?? '640px'"
    @open="handleModalOpen"
    @opened="handleModalOpened"
    @close="handleModalClose"
  >
    <slot></slot>
  </component>
</template>

<style scoped></style>
