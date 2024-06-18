<template>
  <!-- 组件的模板部分 -->
  <div>
    <!-- ModalComponent是一个模态框组件，用于显示准考证信息 -->
    <ModalComponent
      @open="handleOpen"
      modal-name="admission-ticket-info"
      title="准考证"
      :close-on-click-modal="false"
      size="960"
    >
      <!-- 准考证信息容器 -->
      <div class="admission-ticket-info-container" ref="admission_ticket">
        <el-watermark :content="watermark_content">
          <div class="content-container">
            <h3>WRC 2023 AI Will 综合素养参赛证</h3>
            <table cellspacing="0">
              <tr>
                <td>姓名</td>
                <td>{{ content.studentName }}</td>
                <td>证件号码</td>
                <td>{{ content.documentNumber }}</td>
              </tr>
              <tr>
                <td>申报单位</td>
                <td>{{ content.informationName }}</td>
                <td>组别</td>
                <td>{{ content.groupDescribe }}</td>
              </tr>
              <tr>
                <td>考场名称</td>
                <td>{{ content.examinationName }}</td>
                <td>比赛时间</td>
                <td>{{ content.playingTime }}</td>
              </tr>
              <tr>
                <td>比赛网站</td>
                <td>{{ Host }}/exam</td>
                <td>比赛类型</td>
                <td>
                  {{ content.eventType }}
                </td>
              </tr>
              <tr>
                <td>账号/密码</td>
                <td colspan="3">
                  登录名：{{ content.examNumber }} 登录密码：{{
                    content.password
                  }}
                </td>
              </tr>
            </table>
          </div>
        </el-watermark>
      </div>

      <div class="btns">
        <el-space>
          <el-button type="primary" @click="handleExportImage" size="large"
            >导出为图片</el-button
          >
          <!-- 水印开关 -->
          <el-checkbox v-model="watermark" label="水印" size="large" />
        </el-space>
      </div>
    </ModalComponent>
  </div>
</template>
<script setup >
// 响应式数据和生命周期
import { onMounted, reactive, ref, watch } from "vue";
// 自定义的模态框组件ModalComponent
import ModalComponent from "@/components/modal/index.vue";
// html2canvas库，一个可以将HTML元素转换为Canvas图像的JavaScript库
import html2canvas from "html2canvas";
// 导入自定义的下载工具函数download，用于将数据下载为文件
import { download } from "@/utils/downLoad";
// 导入用于获取准考证信息的API调用函数getAdmissionTicket
import { getAdmissionTicket } from "@/api/manage/competition/index";

// 水印是否显示的响应式引用
const watermark = ref(true);
// 水印内容的响应式引用
const watermark_content = ref("WRC 2023 AI Will 综合素养参赛证");
// 比赛网站的主机地址
const Host = import.meta.env.VITE_APP_HOST;

// 监听水印状态变化，并更新水印内容
watch(
  watermark,
  () => {
    watermark_content.value = watermark.value
      ? "WRC 2023 AI Will 综合素养参赛证"
      : "";
  },
  {
    immediate: true,
  }
);
// 准考证信息的响应式引用
const admission_ticket = ref();
const content = ref({});

// 处理模态框打开时的逻辑
const handleOpen = async (e) => {
  let res = await getAdmissionTicket({
    eventId: e.eventId,
    studentId: e.studentId,
  });
  if (res.success) {
    content.value = res.entity;
  }
};

// 导出准考证为图片
const handleExportImage = () => {
  html2canvas(admission_ticket.value)
    .then((canvas) => {
      const image = canvas.toDataURL("image/png");
      console.log(image);
      download(
        content.value.studentName +
          "-" +
          content.value.documentNumber +
          "-准考证.png",
        image,
        "data"
      );
    })
    .catch((err) => {
      console.log(err);
    });
};

// 组件挂载后执行的逻辑
onMounted(() => {
  console.log("mounted!");
});
</script>
<style lang="scss" scoped>
.admission-ticket-info-container {
  width: 100%;
  text-align: center;
  padding: 0px;
  box-sizing: border-box;

  .content-container {
    padding: 32px;
    box-sizing: border-box;
  }

  h3 {
    font-weight: bold;
    padding: 16px 0;
  }

  table {
    width: 100%;
    text-align: center;
    --border-color: #ccc;

    // border: 1px solid #ccc;
    tr {
      td:nth-child(1) {
        border-left: 1px solid var(--border-color);
      }
    }

    tr:nth-child(1) {
      td {
        border-top: 1px solid var(--border-color);
      }
    }

    td {
      border-right: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      min-width: 120px;
      height: 48px;
    }
  }

  .notes-container {
    text-align: left;
    padding-top: 8px;
  }
}

.btns {
  padding-top: 16px;
  display: flex;
  justify-content: center;
}
</style>