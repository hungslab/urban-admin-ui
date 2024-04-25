<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--商品数据-->
                <el-col :span="20" :xs="24">
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                        label-width="68px">
                        <el-form-item label="商品名称" prop="productName">
                            <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="商品标题" prop="productTitle">
                            <el-input v-model="queryParams.productTitle" placeholder="请输入商品标题" clearable
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
                        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"
                            :columns="columns"></right-toolbar>
                    </el-row>

                    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="商品编号" align="center" key="productId" prop="productId"
                            v-if="columns[0].visible" />
                        <el-table-column label="商品名称" align="center" key="productName" prop="productName"
                            v-if="columns[1].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="商品标题" align="center" key="productTitle" prop="productTitle"
                            v-if="columns[2].visible" />
                        <el-table-column label="商品图片" align="center" key="productAvatar" v-if="columns[3].visible">
                            <template slot-scope="scope">
                                <img :src="scope.row.productAvatar"
                                    style="width: 50px; height: 50px; border-radius: 20%;">
                            </template>
                        </el-table-column>
                        <el-table-column label="商品价格" align="center" key="productPrice" prop="productPrice"
                            v-if="columns[4].visible" />
                        <el-table-column label="商品数量" align="center" key="productCount" prop="productCount"
                            v-if="columns[5].visible" width="120" />
                        <el-table-column label="商品销售数量" align="center" key="productSaleCount" prop="productSaleCount"
                            v-if="columns[6].visible" width="120" />

                        <el-table-column label="状态" align="center" key="productStatus" v-if="columns[7].visible">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.productStatus" active-value="0" inactive-value="1"
                                    @change="handleStatusChange(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" align="center" prop="productCreateTime" v-if="columns[8].visible"
                            width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.productCreateTime) }}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                            <template slot-scope="scope" v-if="scope.row.productId !== 1">
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
import { listProduct, addProduct, updateProduct, delProduct } from "@/api/product";

export default {
    name: "Product",
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
            // 用户表格数据
            productList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                productName: undefined,
                productTitle: undefined,
                productStatus: undefined
            },
            // 列信息
            columns: [
                { key: 0, label: `商品编号`, visible: true },
                { key: 1, label: `商品名称`, visible: true },
                { key: 2, label: `商品标题`, visible: true },
                { key: 3, label: `商品图片`, visible: true },
                { key: 4, label: `商品价格`, visible: true },
                { key: 5, label: `商品数量`, visible: true },
                { key: 6, label: `商品销售数量`, visible: true },
                { key: 7, label: `状态`, visible: true },
                { key: 8, label: `创建时间`, visible: true }
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
            listProduct((this.queryParams)).then(response => {
                this.productList = response.data;
                this.loading = false;
            }
            );
        },

        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 商品状态修改
        handleStatusChange(row) {
            let text = row.productStatus === "0" ? "启用" : "停用";
            this.$modal.confirm('确认要"' + text + '""' + row.productName + '"商品吗？').then(function () {
                return changeProductStatus(row.productId, row.productStatus);
            }).then(() => {
                this.$modal.msgSuccess(text + "成功");
            }).catch(function () {
                row.productStatus = row.productStatus === "0" ? "1" : "0";
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                productId: undefined,
                productName: undefined,
                productTitle: undefined,
                productAvatar: undefined,
                productPrice: undefined,
                productCount: undefined,
                productSaleCount: undefined,
                productStatus: undefined,
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
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
        },

        // 删除一条信息
        handleDelete(row) {
            this.$confirm('确定删除当前用户的信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delUserById({ userId: row.userId }).then(() => {
                    this.getList();
                }).catch(() => {
                });
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const userId = row.userId || this.ids;
            getUser(userId).then(response => {
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