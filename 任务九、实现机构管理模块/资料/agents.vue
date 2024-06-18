<template>
  <!-- 机构管理页面的容器 -->
  <div class="header_information page-container">
    <!-- 头部区域，包含标题和分隔线 -->
    <el-row class="header_name">
      <el-col :span="24" class="header_text">
        <h1>机构管理</h1>
      </el-col>
      <el-col :span="24">
        <div class="header_line"></div>
      </el-col>
    </el-row>
    <!-- 按钮区域，包含邀请机构按钮和搜索区域 -->
    <el-row class="el_row_btn">
      <el-col :span="24" class="content">
        <div class="content_top_btn">
          <div>
            <!-- 邀请机构按钮 -->
            <el-button
              @click="handleOpenDialogVisible"
              size="large"
              :icon="Plus"
              >邀请机构</el-button
            >
          </div>
          <!-- 搜索区域 -->
          <el-space>
            <el-input
              clearable
              class="top_search_inp"
              size="large"
              v-model="query_data.organizationName"
              placeholder="请输入机构名称"
            />
            <!-- 省份选择组件 -->
            <ProvinceSelect
              :isW="true"
              v-model:economize="query_data.economize"
              v-model:market="query_data.market"
            />
            <el-button
              size="large"
              :icon="Search"
              circle
              :loading="loading"
              @click="handleSearch"
            />
          </el-space>
        </div>
      </el-col>
    </el-row>
    <!-- 内容区域，包含机构列表 -->
    <el-row>
      <el-col :span="24">
        <el-table
          empty-text="暂无数据..."
          :data="data"
          ref="multipleTableRef"
          border
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column label="机构 ID" prop="userId" width="100" />
          <el-table-column
            label="机构类型"
            prop="schoolNature"
            width="100"
            align="center"
          >
            <template v-slot="{ row }">
              <el-tag
                class="table_btn_success"
                size="small"
                type="warning"
                plain
                v-if="row.schoolNature == 'school'"
                >学校</el-tag
              >
              <el-tag
                class="table_btn_success"
                size="small"
                type="warning"
                plain
                v-else-if="row.schoolNature == 'institution'"
                >机构</el-tag
              >
              <el-tag
                class="table_btn_success"
                size="small"
                type="warning"
                plain
                v-else-if="row.schoolNature == 'team'"
                >团队</el-tag
              >
              <el-tag
                class="table_btn_success"
                size="small"
                type="warning"
                plain
                v-else
                >其他</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="机构名称" prop="name" />
          <el-table-column label="所属省" prop="economizeName" width="150" />
          <el-table-column label="所属市" prop="marketName" width="130" />
          <el-table-column label="创建时间" prop="createTime" width="180" />
          <el-table-column
            label="审核状态"
            prop="auditStatus"
            width="100"
            align="center"
          >
            <template v-slot="{ row }">
              <el-tag
                class="table_btn_success"
                size="small"
                type="warning"
                plain
                v-if="row.auditStatus == 0"
                >等待审核</el-tag
              >
              <el-tag
                class="table_btn_success"
                size="small"
                type="success"
                plain
                v-else-if="row.auditStatus == 1"
                >审核通过</el-tag
              >
              <el-tag
                class="table_btn_success"
                size="small"
                type="danger"
                plain
                v-else-if="row.auditStatus == 2"
                >审核未通过</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="Address" width="100">
            <template v-slot="{ row }">
              <el-dropdown trigger="click">
                <span class="el_dropdown_link">
                  操作<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="handleToDetails(row)"
                      >查看机构信息</el-dropdown-item
                    >
                    <el-dropdown-item @click="handleAuditOperation(row)">
                      审核操作
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- 弹窗------分享邀请码 -->
    <el-dialog v-model="centerDialogVisible" title="分享邀请码" width="40%">
      <span class="dialog_text"
        >官网邀请访问地址，邀请完毕后，如果进行注册将自动添加成为您的客户。</span
      >
      <el-divider />
      <el-input class="dialog_inp" v-model="dialog.channel_url">
        <template #append>
          <el-button type="success" @click="handleCopy">复制</el-button>
        </template>
      </el-input>
      <!-- <span class="dialog_text">组委会可以通过邀请链接邀请机构进行注册。邀请完毕后，将自动添加成为您的客户。</span>
      <el-divider />
      <el-input
        class="dialog_inp"
        v-model="dialog.input2"
      ></el-input> -->
    </el-dialog>
    <!-- 弹窗------审核操作 -->
    <el-dialog
      v-model="centerAuditDialogVisible"
      title="修改审核状态"
      width="512px"
    >
      <el-form :model="form">
        <el-form-item label="机构名称" :label-width="100">
          <el-input
            v-model="form.name"
            autocomplete="off"
            class="dialog_inp"
            disabled
          />
        </el-form-item>
        <el-form-item label="审核状态" :label-width="100">
          <el-select
            v-model="form.auditStatus"
            placeholder="请选择审核状态"
            class="dialog_inp"
          >
            <el-option label="审核通过" value="1" />
            <el-option label="等待审核" value="0" />
            <el-option label="审核拒绝" value="2" />
          </el-select>
        </el-form-item>
        <el-button
          class="save_btn"
          size="large"
          type="primary"
          @click="handleSaveInformation"
          >修改审核状态</el-button
        >
      </el-form>
    </el-dialog>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        @current-change="handlePage"
      />
    </div>
  </div>
</template>

<script  setup>
import { Search, Plus } from "@element-plus/icons-vue";
import ProvinceSelect from "@/components/province-select/index.vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
import { onMounted, ref } from "vue";
import {
  findOrganizationListPage,
  auditOrganization,
} from "@/api/manage/agentmenu/index.js"; // 接口的引入
import { usePage } from "@/hooks/usePage";
import { handleCopyFunc } from "@/utils/copy";

// 使用usePage钩子获取分页数据
const { total, data, loading, query_data, handleLoad, handlePage } = usePage({
  api_fn: findOrganizationListPage,
  q_data: {
    organizationName: "",
    // 省
    economize: "",
    // 市
    market: "",
  },
});
//  获取机构管理列表

// 弹窗------分享邀请码
const centerDialogVisible = ref(false);
// 弹窗------审核操作
const centerAuditDialogVisible = ref(false);
// 打开弹窗
const handleOpenDialogVisible = () => {
  centerDialogVisible.value = true;
};
// 审核操作
const form = ref({
  name: "",
  auditStatus: "",
  userId: "",
});
/**
 * 审核操作
 */
const handleAuditOperation = (row) => {
  centerAuditDialogVisible.value = true;
  form.value.name = row.name;
  form.value.auditStatus = row.auditStatus + "";
  form.value.userId = row.userId;
};

const handleSaveInformation = async () => {
  let res = await auditOrganization(form.value);
  if (res.success) {
    ElMessage({
      message: res.message,
      type: "success",
    });
  } else {
    ElMessage.error(res.message);
  }
  handleLoad(true);
  centerAuditDialogVisible.value = false;
};

const handleSearch = () => {
  handleLoad(true);
};
// 邀请机构
// 分享邀请码
let channel = "";
try {
  const info_data = localStorage.getItem("info_data");
  channel = JSON.parse(info_data).channel;
} catch (error) {}
const Host = import.meta.env.VITE_APP_HOST;
const dialog = ref({
  channel_url: `${Host}/auth/reg/?channel=${channel}`,
  input2: "",
});

/**
 * 复制
 */
const handleCopy = () => {
  handleCopyFunc(dialog.value.channel_url);
  ElMessage.success("复制成功");
};
/**
 * 前往查看机构信息
 */
const handleToDetails = (row) => {
  router.push({
    name: "manage-agents-details",
    params: {
      eventId: row.userId,
    },
  });
};

onMounted(() => {
  handleLoad(true);
});
</script>

<style lang="scss" scoped>
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
    // 线
    .header_line {
      display: block;
      height: 1px;
      width: 100%;
      margin: 24px 0 20px 0;
      background-color: #8473f717;
    }
  }
  //   内容
  :deep(.table_btn_success) {
    padding: 0 5px !important;
    border: none;
  }
  :deep(.el-table) .cell {
    padding: 0 10px;
  }
  .el_row_btn {
    margin-bottom: 20px;
    .content {
      .content_top_btn {
        display: flex;
        justify-content: space-between;
        .top_search_inp {
          width: 300px;
        }
        .top_search_btn {
          width: 110px;
          margin-right: 5px;
        }
      }
    }
  }

  .el_dropdown_link {
    font-size: 14px;
  }
  :deep(.el-table__cell) {
    padding: 12px 0 !important;
  }
  // dialog
  .dialog_text {
    display: block;
    margin-top: 20px;
  }
  .dialog_inp {
    height: 40px;
    :deep(.el-input--suffix) {
      height: 40px;
    }
  }

  // 分页
  .pagination {
    margin-top: 30px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
  }
  // 修改审核状态按钮
  .save_btn {
    margin-left: 100px;
  }
}
</style>