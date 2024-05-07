<template>
    <div class="app-container">
        <el-card class="box-card">
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
                        <el-form-item label="产品编号" prop="reviewProductId">
                            <el-input v-model="queryParams.reviewProductId" placeholder="请输入产品编号" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="订单编号" prop="reviewOrderId">
                            <el-input v-model="queryParams.reviewOrderId" placeholder="请输入订单编号" clearable
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
                            <!-- <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
                                @click="handleUpdate">修改</el-button> -->
                        </el-col>
                        <el-col :span="1.5">
                            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                                @click="handleDelete">删除</el-button>
                        </el-col>

                    </el-row>

                    <el-table v-loading="loading" :data="reviewList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="评论编号" align="center" key="reviewId" prop="reviewId" />
                        <el-table-column label="用户编号" align="center" key="reviewUserId" prop="reviewUserId"
                            v-if="columns[0].visible" />
                        <el-table-column label="产品编号" align="center" key="reviewProductId" prop="reviewProductId"
                            v-if="columns[1].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="订单编号" align="center" key="reviewOrderId" prop="reviewOrderId"
                            v-if="columns[2].visible" />
                        <el-table-column label="评论内容" align="center" key="reviewContent" prop="reviewContent"
                            v-if="columns[4].visible" width="600" :show-overflow-tooltip="true" />

                        <el-table-column label="状态" align="center" key="reviewStatus" v-if="columns[3].visible">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.reviewStatus" active-value="1" inactive-value="0"
                                    @change="handleStatusChange(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        
                        <el-table-column label="创建时间" align="center" prop="reviewCreateTime" v-if="columns[5].visible"
                            width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.reviewCreateTime) }}</span>
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
        </el-card>

        <!-- 添加订单评论对话框 -->
        <el-dialog :title="新增评论" :visible.sync="addopen" width="600px" append-to-body>
            <el-form ref="addForm" :model="addForm" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编号" prop="reviewProductId">
                            <el-input v-model="addForm.reviewProductId" placeholder="请输入商品编号" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="评论内容" prop="reviewContent">
                    <el-input type="textarea" v-model="addForm.reviewContent" :rows="4" placeholder="请输入评论内容"
                        maxlength="200" :maxlength="200">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAddSubmit(addForm)">提交</el-button>
                    <el-button @click="resetAddDialogForm">重置</el-button>
                </el-form-item>

            </el-form>
        </el-dialog>

        <!-- 修改订单评论对话框 -->
        <el-dialog :title="修改评论" :visible.sync="uploadopen" append-to-body>
            <el-form ref="updateForm" :model="updateForm" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="产品编号" prop="reviewProductId">
                            <el-input v-model="updateForm.reviewProductId" placeholder="请输入商品编号" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="评论内容" prop="reviewContent">
                    <el-input type="textarea" v-model="updateForm.reviewContent" :rows="4" placeholder="请输入评论内容"
                        maxlength="200" :maxlength="200">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-form-item>
                <el-button type="primary" @click="handleUploadSubmit(updateForm)">提交</el-button>
                <el-button @click="resetAddDialogForm">重置</el-button>
            </el-form-item>
        </el-dialog>
    </div>
</template>

<script>
import { listReview, delReview, addReview, updateReview } from "@/api/review";

export default {
    name: "Review",
    data() {
        return {
            addForm:{
                reviewProductId: '',
                reviewContent: '',
            },
            dateRange:[],
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 6,
            // 用户表格数据
            reviewList: null,
            // 是否显示弹出层
            addopen: false,
            uploadopen: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                reviewProductId: '',
                reviewOrderId: '',
            },
            // 列信息
            columns: [
                { key: 0, label: `用户编号`, visible: false },
                { key: 1, label: `产品编号`, visible: false },
                { key: 2, label: `订单编号`, visible: true },
                { key: 3, label: `状态`, visible: true },
                { key: 4, label: `评论内容`, visible: true },
                { key: 5, label: `创建时间`, visible: true }
            ],
            // 表单校验
            rules: {
                
            },
            originalReviewtData: {},
            updateForm: {
                reviewId: '',
                reviewProductId: '',
                reviewStatus: '',
                reviewContent: '',
            },
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
            listReview({}).then(response => {
                this.reviewList = response.data;
                this.loading = false;
            }
            );
        },

        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 新增评论
        handleAddSubmit(addForm) {
            // 首先检查订单名称是否为空
            if (!addForm.reviewContent) {
                this.$message.error("请填写评论内容");
                return;
            }
            // 进行表单验证
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    // 如果表单验证通过，则执行提交操作
                    addReview(addForm)
                        .then((response) => {
                            // 成功保存数据后的操作
                            this.$message.success("提交成功");
                            // 清空表单数据
                            this.resetForm("addForm");
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

        // 商品评论状态修改
        handleStatusChange(row) {
            let text = row.reviewStatus === "1" ? "启用" : "封禁";
            this.$confirm('确认要' + ' ' + text + ' ' + "评论编号为:" + row.reviewId + ' 的评论吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    reviewId: row.reviewId,
                    reviewStatus: row.reviewStatus == "1" ? "1" : "0"
                }
                updateReview(data).then(() => {
                    this.getList();
                }).catch(() => {
                });
                this.$message({
                    type: 'success',
                    message: '更新成功!'
                });
            }).catch(() => {
                this.getList()
                this.$message({
                    type: 'info',
                    message: '已取消更新'
                });
            });
        },

        // 取消按钮
        cancel() {
            this.addopen = false;
            this.uploadopen = false;
        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.handleQuery();
        },

        // 多选框选中数据
        handleSelectionChange(selection) {
            if(selection.length == 1){
                this.form = selection
            }
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.addopen = true;
        },

        // 删除一条信息
        handleDelete(row) {
            this.$confirm('确定删除当前评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delReview({ reviewId: row.reviewId }).then(() => {
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

        resetAddDialogForm() {
            this.addForm = {
                reviewProductId: '',
                reviewContent: '',
            };
        },

        
        /** 修改按钮操作 */
        handleUpdate(row) {
            // 设置 updateDialogVisible 为 true，显示修改对话框。
            this.uploadopen = true;
            // 设置 updateForm 对象，用于回显用户信息
            this.updateForm = {
                reviewProductId: row.reviewProductId,
                reviewContent: row.reviewContent,
            };
            // 将最初的用户信息保存到 originalUserData 中
            this.originalReviewtData = { ...this.updateForm };
            
        },

        // 提交
        handleUploadSubmit(updateForm) {
            updateReview(updateForm).then(response => {
                // 处理正常响应
                if (response.code === 200) {
                    this.$message.success('评论更新成功');
                    this.getList();
                } else {
                    // 处理后端返回的错误信息
                    this.$message.error(response.msg);
                }
            }).catch(error => {
                // 处理请求过程中的异常
                this.$message.error('更新评论失败，请重试');
            });
            this.uploadopen = false;
        },

        resetUpdateForm() {
            // 点击重置按钮时，将原始用户信息重新赋值给表单
            this.updateForm = { ...this.originalReviewtData };
        },
    }
};
</script>