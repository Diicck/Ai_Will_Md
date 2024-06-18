<template>
  <!-- 侧边栏容器 -->
  <div class="menu-contaienr">
    <!-- logo -->
    <div class="menu_logo">
      <img src="/logo.png" />
    </div>
    <!-- 侧边栏滚动容器 -->
    <el-scrollbar class="menu-scrollbar-container">
      <div class="menu-container-box" v-if="default_active">
        <!-- 菜单列表 -->
        <el-menu :default-active="default_active" @select="handleMenuSelect">
          <el-menu-item
            v-for="item in menu_list"
            :index="item.index"
            :key="item.index"
          >
            <div class="mange">
              <div class="mange_icon">
                <img
                  class="icon"
                  :src="
                    default_active == item.index ? item.src_active : item.src
                  "
                  alt=""
                />
              </div>
              <span>{{ item.label }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>
    </el-scrollbar>
    <!-- 用户信息部分 -->
    <div class="user-info-container">
      <el-divider></el-divider>
      <div class="user-info">
        <el-avatar src="/avatar.png" :size="48"></el-avatar>
        <el-text>{{ username }}</el-text>
        <!-- 用户操作下拉菜单 -->
        <el-dropdown trigger="click" @command="handleCommand" placement="top">
          <el-icon color="white" size="20">
            <MoreFilled />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="update-password"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item command="exit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- 修改密码模态框 -->
  <el-dialog
    v-model="update_password_modal.show"
    title="修改密码"
    width="524px"
  >
    <el-form
      label-width="132px"
      ref="update_password_modal_data_ref"
      :rules="update_password_modal.rules"
      :model="update_password_modal.form_data"
    >
      <el-form-item label="新密码" prop="password">
        <el-input
          v-model="update_password_modal.form_data.password"
          type="password"
          size="large"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item label="再次输入新密码" prop="password2">
        <el-input
          v-model="update_password_modal.form_data.password2"
          type="password"
          size="large"
          placeholder="再次输入新密码"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="large"
          style="width: 120px"
          @click="handleUpdatePasword"
          >修改密码</el-button
        >
        <el-button size="large" @click="update_password_modal.show = false"
          >取消</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 下载模态框引用 -->
  <DownloadModal ref="DownloadModalRef" />
</template>

<script  setup>
import { useUserStore } from "@/store/user";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref, computed } from "vue";
import { UpdatePasswordApi } from "@/api/user";
import { ElMessage } from "element-plus";
// 引入下载模态框组件
import DownloadModal from "@/components/download-modal/index.vue";
// 图片资源导入
import o1 from "@/assets/images/Manage/organ1.png";
import o2 from "@/assets/images/Manage/organ2.png";
import o3 from "@/assets/images/Manage/organ3.png";
import o4 from "@/assets/images/Manage/organ4.png";
import o5 from "@/assets/images/Manage/organ5.png";
import o6 from "@/assets/images/Manage/organ6.png";
import o7 from "@/assets/images/Manage/organ7.png";
import o8 from "@/assets/images/Manage/organ8.png";
import o1_active1 from "@/assets/images/Manage/organ1_active.png";
import o1_active2 from "@/assets/images/Manage/organ2_active.png";
import o1_active3 from "@/assets/images/Manage/organ3_active.png";
import o1_active4 from "@/assets/images/Manage/organ4_active.png";
import o1_active5 from "@/assets/images/Manage/organ5_active.png";
import o1_active6 from "@/assets/images/Manage/organ6_active.png";
import o1_active7 from "@/assets/images/Manage/organ7_active.png";
import o1_active8 from "@/assets/images/Manage/organ8_active.png";
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const default_active = ref("");
const DownloadModalRef = ref();
// 侧边栏菜单列表
// 1级
const organizing = ref([
  {
    src: o1,
    src_active: o1_active1,
    index: "manage-organizingmation",
    label: "总负责人信息",
  },
  {
    src: o2,
    src_active: o1_active2,
    index: "manage-agentmanagement",
    label: "组委会管理",
  },
  {
    src: o4,
    src_active: o1_active4,
    index: "manage-fenzugroupmanagement",
    label: "分组管理",
  },
  {
    src: o4,
    src_active: o1_active4,
    index: "manage-event_type",
    label: "赛项类型管理",
  },
  // event_type
  {
    src: o3,
    src_active: o1_active3,
    index: "manage-organtionmanagement",
    label: "机构管理",
  },
  {
    src: o8,
    src_active: o1_active8,
    index: "manage-registrationmanagement",
    label: "报名管理",
  },
  {
    src: o5,
    src_active: o1_active5,
    index: "manage-personnelmanagement",
    label: "人员管理",
  },
  {
    src: o6,
    src_active: o1_active6,
    index: "manage-cansaientryreview",
    label: "参赛审核",
  },
  {
    src: o7,
    src_active: o1_active7,
    index: "manage-tongjistatements",
    label: "统计与报表",
  },
  {
    src: o7,
    src_active: o1_active7,
    index: "download",
    label: "下载专区",
    type: "modal",
  },
]);
// 2级
const agent = ref([
  {
    src: o1,
    src_active: o1_active1,
    index: "manage-committee",
    label: "组委会信息",
  },
  {
    src: o2,
    src_active: o1_active2,
    index: "manage-agents",
    label: "机构管理",
  },
  {
    src: o6,
    src_active: o1_active6,
    index: "manage-organization",
    label: "参赛审核",
  },
  {
    src: o7,
    src_active: o1_active7,
    index: "manage-statisticstements",
    label: "统计与报表",
  },
  {
    src: o8,
    src_active: o1_active8,
    index: "manage-IDCodeAcquisition",
    label: "ID码获取",
  },
  {
    src: o7,
    src_active: o1_active7,
    index: "download",
    label: "下载专区",
    type: "modal",
  },
]);
// 3级
const institution = ref([
  {
    src: o1,
    src_active: o1_active1,
    index: "manage-organizationinfo",
    label: "机构信息",
  },
  {
    src: o5,
    src_active: o1_active5,
    index: "manage-personnel",
    label: "人员管理",
  },
  {
    src: o4,
    src_active: o1_active4,
    index: "manage-registration",
    label: "报名管理",
  },
  {
    src: o8,
    src_active: o1_active8,
    index: "manage-IDCodeAcquisition",
    label: "ID码获取",
  },
  {
    src: o7,
    src_active: o1_active7,
    index: "download",
    label: "下载专区",
    type: "modal",
  },

  // { src: o8, src_active: o1_active8, index: 'manage-idassistant', label: "ID码助手" },
]);
const tecRouter = ref([
  { src: o1, src_active: o1_active1, index: "tecinfo", label: "老师信息" },
  { src: o1, src_active: o1_active1, index: "wait_list", label: "待批阅列表" },
]);
// 权限计算属性
const menu_list = computed(() => {
  if (userStore.info_data.role == "organizing") {
    return organizing.value;
  } else if (userStore.info_data.role == "agent") {
    return agent.value;
  } else if (userStore.info_data.role == "institution") {
    return institution.value;
  } else if (userStore.info_data.role == "tec") {
    return tecRouter.value;
  }
});
// 修改密码模态框状态
const update_password_modal_data_ref = ref();
const checkPassword2 = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入密码"));
  }

  if (value == update_password_modal.value.form_data.password) {
    callback();
  } else {
    callback(new Error("两次密码不一致"));
  }
};

const update_password_modal = ref({
  show: false,
  form_data: {
    password: "",
    password2: "",
  },
  rules: {
    password: [
      {
        type: "string",
        required: true,
        message: "请输入密码",
        trigger: "blur",
      },
    ],
    password2: [
      {
        type: "string",
        required: true,
        validator: checkPassword2,
        trigger: "blur",
      },
    ],
  },
});
const handleCommand = (command) => {
  if (command == "update-password") {
    update_password_modal.value.show = true;
  } else if (command == "exit") {
    userStore.handleExit();
    router.push({
      path: "/auth/login",
    });
  }
};
// 用户名计算属性
const username = computed(() => {
  if (userStore.info_data.role == "organizing") {
    return "总负责人";
  } else if (userStore.info_data.role == "agent") {
    return "组委会负责人";
  } else if (userStore.info_data.role == "institution") {
    return "机构负责人";
  } else if (userStore.info_data.role == "tec") {
    return "老师";
  }
});

// 修改密码
const handleUpdatePasword = () => {
  update_password_modal_data_ref.value.validate(async (r) => {
    if (!r) {
      return;
    }
    let res = await UpdatePasswordApi({
      password: update_password_modal.value.form_data.password,
    });
    if (res.success) {
      ElMessage.success(res.message);
      handleCommand("exit");
    } else {
      ElMessage.error(res.message);
    }
  });
};
/**
 * 菜单选择
 */
const handleMenuSelect = (index) => {
  let find = menu_list.value.find((item) => item.index == index);
  if (find) {
    if (find.type == "modal" && find.index == "download") {
      DownloadModalRef.value.handleOpenModal();
    } else {
      default_active.value = index;
      router.push({
        name: index,
      });
    }
  }
};
// 组件挂载后执行的逻辑
onMounted(() => {
  if (route.fullPath == "/manage") {
    // 默认三个级别的首次打开
    const map = {
      organizing: "manage-organizingmation",
      agent: "manage-committee",
      institution: "manage-organizationinfo",
      tec: "tecinfo",
    };
    router.push({
      name: map[userStore.info_data.role],
    });
    default_active.value = map[userStore.info_data.role];
  } else {
    default_active.value = route.meta.index;
  }
});
</script>

<style lang="scss" scoped>
.menu-contaienr {
  width: 100%;
  height: 100%;
  // background-image: -webkit-linear-gradient(0deg, #5d5cf8 0, #5754e4 100%);
  // padding-top: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .el-menu {
    background-color: #ffffff00;
    border-right: solid 0px #e6e6e6;
  }

  .el-menu-item.is-active {
    font-weight: bold;
    color: #05c3de;
    background: #8473f71f;
  }

  .el-menu-item {
    display: flex !important;
    align-items: center !important;
    color: #fff;
    border-radius: 30px 0 0 30px;

    &:hover {
      outline: 0;
      background-color: #0000000d;
      border-radius: 30px 0 0 30px;
    }

    .mange {
      display: flex;
      align-items: center;
      justify-content: center;

      .mange_icon {
        width: 32px;
        height: 32px;
        display: block;
        display: flex;
        align-items: center;

        .icon {
          width: 80%;
          height: 75%;
          color: red;
        }
      }
    }
  }

  .is-active {
    font-size: 22px !important;
    font-weight: 500;
    text-align: center;
    letter-spacing: 0px;
    color: #1e76de !important;
    background-color: #fff !important;
    border-radius: 30px 0 0 30px;
  }

  .menu_logo {
    box-sizing: border-box;
    display: flex;
    // justify-content: center;
    padding: 16px 0 0 18px;

    img {
      height: 55px;
      width: 160px;
    }
  }

  .menu-scrollbar-container {
    height: calc(100% - 64px - 120px);
  }

  .menu-container-box {
    padding-top: 32px;
  }

  .user-info-container {
    box-sizing: border-box;
    padding-right: 24px;
    height: 120px;
    display: flex;
    flex-direction: column;

    .user-info {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-text {
        padding: 0 8px;
        color: white;
      }

      .el-icon {
        cursor: pointer;
      }
    }
  }

  .el-menu-item {
    margin-bottom: 24px;
  }

  .el-menu-item:last-child {
    margin-bottom: 0px;
  }

  .el-menu-item * {
    vertical-align: baseline;
  }
}

span {
  font-size: 14px;
}
</style>