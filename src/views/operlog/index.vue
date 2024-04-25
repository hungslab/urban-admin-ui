<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--商品数据-->
                <el-col :span="20" :xs="24">
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                        label-width="68px">
                        <el-form-item label="商品名称" prop="description">
                            <el-input v-model="queryParams.description" placeholder="请输入操作描述" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="商品标题" prop="jsonResult">
                            <el-input v-model="queryParams.jsonResult" placeholder="请输入返回结果" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd"
                                type="daterange" range-separator="-" start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini"
                                @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row :gutter="10" class="mb8">
                        <el-col :span="1.5">
                            <el-button type="primary" plain icon="el-icon-plus" size="mini"
                                @click="handleAdd">新增</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
                                @click="handleUpdate">修改</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                                @click="handleDelete">删除</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="info" plain icon="el-icon-upload2" size="mini"
                                @click="handleImport">导入</el-button>
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="warning" plain icon="el-icon-download" size="mini"
                                @click="handleExport">导出</el-button>
                        </el-col>
                        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                            :columns="columns"></right-toolbar>
                    </el-row>

                    <el-table v-loading="loading" :data="operLogList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="操作日志编号" align="center" key="operId" prop="operId"
                            v-if="columns[0].visible" />
                        <el-table-column label="操作内容描述" align="center" key="description" prop="description"
                            v-if="columns[1].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="操作人员" align="center" key="operName" prop="operName"
                            v-if="columns[2].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="IP地址" align="center" key="operIp" prop="operIp"
                            v-if="columns[3].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="方法名称" align="center" key="method" prop="method"
                            v-if="columns[4].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="请求参数" align="center" :show-overflow-tooltip="true" key="operParam"
                            prop="operParam" v-if="columns[5].visible" width="120" />
                        <el-table-column label="返回参数" align="center" :show-overflow-tooltip="true"  key="jsonResult"
                            prop="jsonResult" v-if="columns[6].visible" width="120" />
                        <el-table-column label="创建时间" align="center" prop="operTime" v-if="columns[7].visible"
                            width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.operTime) }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                            <template slot-scope="scope" v-if="scope.row.operId !== 1">
                                <el-button size="mini" type="text" icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)">修改</el-button>
                                <el-button size="mini" type="text" icon="el-icon-delete"
                                    @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="pageSizes"
                        :total="this.total" @size-change="handleSizeChange" @current-change="handlePageChange" />
                </el-col>
            </el-row>
        </el-card>




        <!-- 添加或修改用户配置对话框 -->
        <!-- <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属部门" prop="deptId">
                            <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true"
                                placeholder="请选择归属部门" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户名称" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20"
                                show-password />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户性别">
                            <el-select v-model="form.sex" placeholder="请选择性别">
                                <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label"
                                    :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value"
                                    :label="dict.value">{{dict.label}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="岗位">
                            <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                                <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName"
                                    :value="item.postId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色">
                            <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
                                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName"
                                    :value="item.roleId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog> -->

    </div>
</template>

<script>
import { listOperLog, delOperlog } from "@/api/operlog";

export default {
    name: "Operlog",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 6,
            // 表格数据
            operLogList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                description: undefined,
                jsonResult: undefined
            },
            // 列信息
            columns: [
                { key: 0, label: `操作日志编号`, visible: true },
                { key: 1, label: `操作内容描述`, visible: true },
                { key: 2, label: `操作人员`, visible: true },
                { key: 3, label: `IP地址`, visible: true},
                { key: 4, label: `方法名称`, visible: true },
                { key: 5, label: `请求参数`, visible: true },
                { key: 6, label: `返回参数`, visible: true },
                { key: 7, label: `操作时间`, visible: true }
            ],
            // 表单校验
            rules: {

            }
        };
    },
    watch: {

    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询商品列表 */
        getList() {
            this.loading = true;
            listOperLog((this.queryParams)).then(response => {
                this.operLogList = response.data;
                this.loading = false;
            }
            );
        },

        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },


        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                operId: undefined,
                description: undefined,
                operName: undefined,
                operIp: undefined,
                operatorType: undefined,
                method: undefined,
                operParam: undefined,
                jsonResult: undefined
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.operId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            getUser().then(response => {
                this.postOptions = response.posts;
                this.roleOptions = response.roles;
                this.open = true;
                this.title = "添加用户";
                this.form.password = this.initPassword;
            });
        },
        
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const operId = row.operId || this.ids;
            getUser(operId).then(response => {
                this.form = response.data;
                this.postOptions = response.posts;
                this.roleOptions = response.roles;
                this.$set(this.form, "postIds", response.postIds);
                this.$set(this.form, "roleIds", response.roleIds);
                this.open = true;
                this.title = "修改用户";
                this.form.password = "";
            });
        },
    }
};
</script>