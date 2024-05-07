<template>
    <div class="app-container">
        <el-card class="box-card">
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                        label-width="68px">
                        <el-form-item label="订单名称" prop="orderName">
                            <el-input v-model="queryParams.orderName" placeholder="请输入订单名称" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="用户名称" prop="orderUser">
                            <el-input v-model="queryParams.orderUser" placeholder="请输入订单名称" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单编号" prop="orderId">
                            <el-input v-model="queryParams.orderId" placeholder="请输入订单编号" clearable style="width: 240px"
                                @keyup.enter.native="handleQuery" />
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

                    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="订单编号" align="center" key="orderId" prop="orderId" />
                        <el-table-column label="订单名称" align="center" key="orderName" prop="orderName"
                            :show-overflow-tooltip="true" />
                        <el-table-column label="用户名称" align="center" key="orderUser" prop="orderUser"
                            :show-overflow-tooltip="true" />
                        <el-table-column label="价格" align="center" prop="orderPrice" width="120" />
                        <el-table-column label="支付方式" align="center" prop="payWay" width="120" />

                        <el-table-column label="订单状态" align="center" key="orderStatus">
                            <template slot-scope="scope">
                                <el-button v-model="scope.row.orderStatus" type="info" size="small">
                                    {{ scope.row.orderStatus === '1' ? '已支付' : '未支付' }}
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" align="center" prop="createTime" width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.createTime) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                            <template slot-scope="scope" v-if="scope.row.orderId !== 1">
                                <el-button size="mini" type="text" icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)">修改</el-button>
                                <el-button size="mini" type="text" icon="el-icon-delete"
                                    @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="pageSizes"
                        :total="queryParams.total" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </el-card>

        <!-- 新增订单对话框 -->
        <el-dialog :title="增加订单" :visible.sync="addopen">
            <el-form ref="addOrderForm" :model="addOrderForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单名称" prop="orderName">
                    <el-input v-model="addOrderForm.orderName" />
                </el-form-item>
                <el-form-item label="用户名称" prop="orderUser">
                    <el-input v-model="addOrderForm.orderUser" />
                </el-form-item>
                <el-form-item label="支付方式" prop="payWay">
                    <el-select v-model="addOrderForm.payWay" placeholder="请选择支付方式">
                        <el-option label="支付宝" value="支付宝" />
                        <el-option label="微信" value="微信" />
                        <el-option label="银行卡" value="银行卡" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单价格" prop="orderPrice">
                    <el-input v-model="addOrderForm.orderPrice" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddSubmit(addOrderForm)">提交</el-button>
                    <el-button @click="resetAddDialogForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改订单对话框 -->
        <el-dialog :title="修改订单信息" :visible.sync="uploadopen" width="50%">
            <el-form ref="updateForm" :rules="updateRules" label-width="120px" class="update-dialog">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="订单名称" prop="orderName">
                            <el-input v-model="updateForm.orderName" :disabled="true" />
                        </el-form-item>
                        <el-form-item label="用户名称" prop="orderUser">
                            <el-input v-model="updateForm.orderUser" />
                        </el-form-item>
                        <el-form-item label="支付方式" prop="payWay">
                            <el-select v-model="updateForm.payWay" placeholder="请选择支付方式">
                                <el-option label="支付宝" value="支付宝" />
                                <el-option label="微信" value="微信" />
                                <el-option label="银行卡" value="银行卡" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单价格" prop="orderPrice">
                            <el-input v-model="updateForm.orderPrice" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="订单状态" prop="orderStatus">
                            <el-radio-group v-model="updateForm.orderStatus">
                                <el-radio label="1">已支付</el-radio>
                                <el-radio label="0">未支付</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdateSubmit(updateForm)">提交</el-button>
                    <el-button @click="resetUpdateForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {
    delOrder,
    addOrder,
    updateOrder,
    orderList
} from "@/api/order";
import { get } from "js-cookie";

export default {
    name: "User",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 用户表格数据
            orderList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            addopen: false,
            uploadopen: false,
            // 查询参数
            queryParams: {
                orderName: undefined,
                payWay: undefined,
                status: undefined,
            },

            addOrderForm: {
                orderName: "",
                orderUser: "",
                payWay: "",
                orderPrice: "",
            },
            rules: {
                orderName: [
                    { required: true, message: "请输入订单名称", trigger: "blur" },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
                ],
                orderUser: [
                    { required: true, message: "请输入用户名称", trigger: "blur" },
                    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur"}
                ],
                payWay: [
                    { required: true, message: "请选择支付方式", trigger: "blur" },
                ],
                orderPrice: [
                    { required: true, message: "请输入订单价格", trigger: "blur" }
                ],
            },

            updateForm: {
                orderId: undefined,
                orderName: undefined,
                orderUser: undefined,
                payWay: undefined,
                orderPrice: undefined,
                orderStatus: undefined,
                createTime: undefined,
            },
            originalOrderData: {}, // 保存原始订单信息的对象
            // 定义一个映射关系
            statusMapping: {
                0: '未支付',
                1: '已支付'
            }
        };
    },

    watch: {},
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.loading = true;
            orderList(this.queryParams).then((response) => {
                console.log(response);
                this.orderList = response.data;
                this.total = 6;
                this.loading = false;
            });
        },

        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        
        // 取消按钮
        cancel() {
            this.addopen = false;
            this.uploadopen = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                orderId: undefined,
                orderName: undefined,
                orderUser: undefined,
                payWay: undefined,
                orderPrice: undefined,
                orderStatus: undefined,
                createTime: undefined
            };
            this.resetForm("form");
        },

        resetAddDialogForm() {
            this.addOrderForm = {
                orderName: "",
                orderUser: "",
                payWay: "",
                orderPrice: ""
            }
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
            this.queryParams.deptId = undefined;
            this.$refs.tree.setCurrentKey(null);
            this.handleQuery();
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.orderId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },


        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.addopen = true;
        },

        // 删除一条信息
        handleDelete(row) {
            this.$confirm("确定删除当前订单的信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delOrder({ orderId: row.orderId })
                        .then(() => {
                            this.getList();
                        })
                        .catch(() => { });
                    this.$message({
                        type: "success",
                        message: "删除成功!",
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },

        /** 提交按钮 */
        handleAddSubmit(addOrderForm) {
            // 首先检查订单名称是否为空
            if (!addOrderForm.orderName) {
                this.$message.error("请填写订单名称");
                return;
            }
            // 进行表单验证
            this.$refs.addOrderForm.validate((valid) => {
                if (valid) {
                    // 如果表单验证通过，则执行提交操作
                    addOrder(addOrderForm)
                        .then((response) => {
                            // 成功保存数据后的操作
                            this.$message.success("提交成功");
                            // 清空表单数据
                            this.resetForm("addOrderForm");
                            this.getList();
                            // 关闭对话框
                            this.addopen = false;
                        })
                        .catch((error) => {
                            // 处理保存失败的情况
                            this.$message.error("提交失败，请稍后重试");
                        });
                } else {
                    // 如果表单验证失败，则给出相应的提示
                    this.$message.error("表单验证失败，请检查输入");
                    return false;
                }
            });
        },

        handleUpdateSubmit(updatForm) {

            updateOrder(updatForm).then(response => {
                // 处理正常响应
                if (response.code === 200) {
                    this.$message.success('订单信息更新成功');
                    this.getList();
                } else {
                    // 处理后端返回的错误信息
                    this.$message.error(response.msg);
                }
            }).catch(error => {
                // 处理请求过程中的异常
                this.$message.error('更新订单失败，请重试');
            });
            this.uploadopen = false;
        },

        handleUpdate(row) {
            // 设置 updateDialogVisible 为 true，显示修改对话框。
            this.uploadopen = true;
            // 设置 updateForm 对象，用于回显用户信息
            this.updateForm = {
                orderId: row.orderId,
                orderName: row.orderName,
                orderUser: row.orderUser,
                payWay: row.payWay,
                orderPrice: row.orderPrice,
                orderStatus: row.orderStatus
            };
            // 将最初的用户信息保存到 originalUserData 中
            this.originalOrderData = { ...this.updateForm };
        },

        // handleUpdateSubmit(formData) {
        //     // 调用后端 API 更新用户信息
        //     updateOrder(formData)
        //         .then(response => {
        //             // 更新成功后的处理
        //             this.$message.success('订单信息更新成功');
        //         })
        //         .catch(error => {
        //             // 更新失败后的处理
        //             this.$message.error('订单信息更新失败');
        //         });
        //     this.updateDialogVisible = false;
        // },
        resetUpdateForm() {
            // 点击重置按钮时，将原始用户信息重新赋值给表单
            this.updateForm = { ...this.originalOrderData };
        },
    }

};
</script>