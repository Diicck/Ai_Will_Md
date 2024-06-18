<template>
  <div class="header_information page-container">
    <!-- 头部 -->
    <el-row class="header_name">
      <el-col :span="24" class="header_text">
        <h1>总负责人信息</h1>
      </el-col>
      <el-col :span="24">
        <div class="header_line"></div>
      </el-col>
    </el-row>
    <!-- 表格内容 -->
    <el-row>
      <!-- 组委会信息 -->
      <el-col :span="24">
        <h3 class="contnet_text">总负责人信息</h3>
        <el-form
          :model="form"
          ref="i_data_ref"
          :rules="i_data_rules"
          label-width="100px"
        >
          <el-form-item label="组委会名称" prop="name">
            <el-input
              placeholder="请填写单位名称"
              v-model="form.name"
              class="content_input"
              v-model.trim="inputValueTrim"
            />
          </el-form-item>
          <el-form-item label="所在地区" prop="county">
            <div class="select_region">
              <ProvinceSelect
                v-model:economize="form.economize"
                v-model:market="form.market"
                v-model:county="form.county"
                :showCounty="true"
              />
            </div>
          </el-form-item>

          <div class="select_region">
            <el-form-item label="邮寄地址" prop="address">
              <el-input
                v-model="form.address"
                placeholder="请填写机构邮寄地址"
                class="content_input"
                v-model.trim="inputValueTrim"
              />
            </el-form-item>
          </div>
          <!-- 联系方式 -->
          <el-col :span="24">
            <h3 class="contnet_text">联系方式</h3>
            <el-form-item label="联系人姓名" prop="headName">
              <el-input
                placeholder="请输入联系人姓名"
                v-model="form.headName"
                class="content_input"
                v-model.trim="inputValueTrim"
              />
            </el-form-item>

            <el-form-item label="电话号码" prop="headPhone">
              <el-input
                placeholder="请输入联系人电话号码"
                v-model="form.headPhone"
                class="content_input"
                v-model.trim="inputValueTrim"
              />
            </el-form-item>

            <el-form-item label="联系邮箱" prop="headEmail">
              <el-input
                placeholder="请输入联系人邮箱"
                v-model="form.headEmail"
                class="content_input"
                v-model.trim="inputValueTrim"
              />
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>

      <el-button
        class="save_btn"
        size="large"
        color="#1964d6"
        @click="handleSaveInformation"
        >保存信息</el-button
      >
    </el-row>
  </div>
</template>

<script  setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
// 接口
import {
  getInformation,
  saveInformation,
} from "@/api/manage/organcommitmenu/index.js";
import ProvinceSelect from "@/components/province-select/index.vue";

// 基本信息
const form = ref({});
const handleGetInformation = async () => {
  let res = await getInformation();
  form.value = res.entity;
};

// 保存基本信息
const handleSaveInformation = async () => {
  i_data_ref.value.validate(async (v) => {
    if (!v) {
      return;
    }

    let res = await saveInformation(form.value);
    if (res.success) {
      ElMessage({
        message: "保存信息成功",
        type: "success",
      });
      handleGetInformation();
    }
  });
};

//  验证
const i_data_ref = ref();
const inputValueTrim = ref("");
// 手机号
const checkPhone = (rule, value, callback) => {
  const phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
  if (!value) {
    callback(new Error("手机号码不能为空"));
  }
  if (phoneReg.test(value)) {
    callback();
  } else {
    callback(new Error("手机号码格式错误"));
  }
};

const checkName = (rule, value, callback) => {
  const chineseCharactersRegex = /^[\u4e00-\u9fa5]+$/;

  if (!chineseCharactersRegex.test(value)) {
    callback(new Error("请输入中文"));
  } else {
    // Validation passed
    callback();
  }
};

const i_data_rules = ref({
  name: [
    {
      type: "string",
      required: true,
      message: "请输入单位名称",
      trigger: "blur",
    },
    {
      min: 2,
      max: 10,
      message: "单位名称请输入 2-10 个字符",
      trigger: "blur",
    },
  ],
  county: [
    {
      required: true,
      message: "请选择所在地区",
      trigger: "blur",
    },
  ],
  address: [
    {
      type: "string",
      required: true,
      message: "请输入地址",
      trigger: "blur",
    },
    {
      min: 2,
      max: 120,
      message: "地址请输入 2-120 个字符",
      trigger: "blur",
    },
  ],
  headName: [
    {
      required: true,
      validator: checkName,
      trigger: "blur",
    },
    {
      min: 2,
      max: 8,
      message: "联系人姓名请输入 2-8 个字符",
      trigger: "blur",
    },
  ],
  headPhone: [
    {
      required: true,
      validator: checkPhone,
      trigger: "blur",
    },
  ],
  headEmail: [
    {
      type: "string",
      required: true,
      message: "请输入联系邮箱",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        // 使用正则表达式验证邮箱格式
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (emailPattern.test(value)) {
          // 邮箱格式合法，通过校验
          callback();
        } else {
          // 邮箱格式不合法，校验失败，显示提示信息
          callback(new Error("联系邮箱格式不正确"));
        }
      },
      trigger: "blur",
    },
  ],
});

onMounted(() => {
  handleGetInformation();
});
</script>

<style lang="scss" scoped>
:deep(.el-space__item) {
  &:nth-child(3) {
    margin: 0 !important;
  }
}
.header_information {
  padding: 20px;
  .header_name {
    margin-left: 10px;
    margin-right: 10px;
    .header_text {
      margin-left: -10px;
      margin-right: -10px;
    }
    h1 {
      font-size: 28px;
    }
  }

  .header_line {
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #8473f717;
  }
  .contnet_text {
    margin-bottom: 14px;
  }
  .content_input {
    width: 500px;
  }
  :deep(.el-input__wrapper) {
    padding: 0 15px;
  }
  :deep(.el-input.is-disabled) .el-input__inner {
    background-color: #f5f5f5;
  }
  .select_region {
    width: 500px;
    display: flex;
    justify-content: space-between;
    .el_form_content_text {
      width: 500px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .content_text_relation {
        font-size: 14px;
      }
      .content_text_contacts {
        color: #000;
        font-weight: bold;
      }
      span {
        color: #202020;
        font-size: 14px;
      }
    }
  }
  :deep(.el-input) {
    height: 40px;
  }
  .content_select {
    width: 160px;
  }
  // 保存信息按钮
  .save_btn {
    margin-left: 100px;
  }
}
</style>