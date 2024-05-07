<template>
    <div class="app-container">
        <el-card class="box-card">
            
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
                            <!-- <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
                                @click="handleUpdate">修改</el-button> -->
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
                            v-if="columns[1].visible" width="200" :show-overflow-tooltip="true" />
                        <el-table-column label="商品标题" align="center" key="productTitle" prop="productTitle"
                            v-if="columns[2].visible" width="200" :show-overflow-tooltip="true" />
                        <el-table-column label="商品图片" align="center" key="productAvatar" v-if="columns[3].visible">
                            <template slot-scope="scope">
                                <img :src="scope.row.productAvatar"
                                    style="width: 50px; height: 50px; border-radius: 20%" />
                            </template>
                        </el-table-column>
                        <el-table-column label="商品价格" align="center" key="productPrice" prop="productPrice"
                            v-if="columns[4].visible" />
                        <el-table-column label="商品数量" align="center" key="productCount" prop="productCount"
                            v-if="columns[5].visible"/>
                        <el-table-column label="商品销售数量" align="center" key="productSaleCount" prop="productSaleCount"
                            v-if="columns[6].visible"/>

                        <el-table-column label="上架状态" align="center" key="productStatus" v-if="columns[7].visible">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.productStatus" active-value="1" inactive-value="0"
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
                                <el-button size="mini" type="text" @click="payClick()">支付</el-button>
                                <el-button v-if="scope.row.productCount <= 100" size="mini" type="danger">
                                    当前商品库存紧张!!!
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="pageSizes"
                        :total="this.total" @size-change="handleSizeChange" @current-change="handlePageChange" />

        </el-card>

        <!-- 新增商品对话框 -->
        <el-dialog :title="增加商品" :visible.sync="addopen">
            <el-form ref="addProductForm" :model="addProductForm" :rules="rules" label-width="100px"
                class="demo-ruleForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品名称" prop="productName">
                            <el-input v-model="addProductForm.productName" placeholder="请输入商品名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品标题" prop="productTitle">
                            <el-input v-model="addProductForm.productTitle" placeholder="请输入商品标题" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品价格" prop="productPrice">
                            <el-input v-model="addProductForm.productPrice" placeholder="请输入商品价格" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品数量" prop="productCount">
                            <el-input v-model="addProductForm.productCount" placeholder="请输入商品数量" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="商品销售数量" prop="productSaleCount">
                            <el-input v-model="addProductForm.productSaleCount" placeholder="请输入商品销售数量"
                                maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="handleAddSubmit(addProductForm)">提交</el-button>
                    <el-button @click="resetAddDialogForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改订单配置对话框 -->
        <el-dialog :title="修改订单" :visible.sync="uploadopen" append-to-body>
            <el-form ref="updateForm" :model="updateForm" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品名称" prop="productName">
                            <el-input v-model="updateForm.productName" placeholder="请输入商品名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品标题" prop="productTitle">
                            <el-input v-model="updateForm.productTitle" placeholder="请输入商品标题" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="商品价格" prop="productPrice">
                            <el-input v-model="updateForm.productPrice" placeholder="请输入商品价格" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="商品数量" prop="productCount">
                            <el-input v-model="updateForm.productCount" placeholder="请输入商品数量" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="商品销售数量" prop="productSaleCount">
                            <el-input v-model="updateForm.productSaleCount" placeholder="请输入商品销售数量" maxlength="50" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleUploadSubmit(updateForm)">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listProduct,
    addProduct,
    updateProduct,
    delProduct,
} from "@/api/product";

export default {
    name: "Product",
    data() {
        return {
            dateRange: [],
            // 遮罩层
            loading: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 6,
            // 商品表格数据
            productList: null,
            // 是否显示弹出层
            addopen: false,
            uploadopen: false,
            title: "",
            // 查询参数
            queryParams: {
                productName: undefined,
                productTitle: undefined,
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
                { key: 8, label: `创建时间`, visible: true },
            ],
            // 表单校验
            rules: {
                productName: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
                productTitle: [{ required: true, message: "请输入商品标题", trigger: "blur" }],
                productPrice: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
                productCount: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
                productSaleCount: [{ required: true, message: "请输入商品销售数量", trigger: "blur" }],
            },

            originalProductData: {
                productName: undefined,
                productTitle: undefined,
                productPrice: undefined,
                productCount: undefined,
                productSaleCount: undefined,
            },

            addProductForm: {
                productName: '',
                productTitle: '',
                productPrice: '',
                productCount: '',
                productSaleCount: '',
            },

            updateForm: {
                productId: undefined,
                productName: undefined,
                productTitle: undefined,
                productAvatar: undefined,
                productPrice: undefined,
                productCount: undefined,
                productSaleCount: undefined,
                productStatus: undefined,
            },
        };
    },
    watch: {},
    created() {
        this.getList();
    },
    methods: {
        payClick() {
            this.$router.push("/pay");
        },

        /** 查询商品列表 */
        getList() {
            this.loading = true;
            listProduct(this.queryParams).then((response) => {
                this.productList = response.data;
                this.loading = false;
            });
        },

        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },


        // 商品状态修改
        handleStatusChange(row) {
            let text = row.status === "1" ? "上架" : "下架";
            this.$confirm('确认要' + ' ' + text + ' ' + row.productName + ' 商品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    productId: row.productId,
                    productStatus: row.productStatus == "1" ? "1" : "0"
                }
                updateProduct(data).then(() => {
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

        resetAddDialogForm() {
            this.addProductForm = {
                productName: undefined,
                productTitle: undefined,
                productPrice: undefined,
                productCount: undefined,
                productSaleCount: undefined,
            };
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.addopen = true;
        },

        // 删除一条信息
        handleDelete(row) {
            this.$confirm("确定删除当前商品的信息, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    delProduct({ productId: row.productId })
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

        /** 修改按钮操作 */
        handleUpdate(row) {
            // 设置 updateDialogVisible 为 true，显示修改对话框。
            this.uploadopen = true;
            // 设置 updateForm 对象，用于回显用户信息
            this.updateForm = {
                productId: row.productId,
                productName: row.productName,
                productTitle: row.productTitle,
                productPrice: row.productPrice,
                productCount: row.productCount,
                productSaleCount: row.productSaleCount
            };
            // 将最初的用户信息保存到 originalUserData 中
            this.originalProductData = { ...this.updateForm };
        },

        // 新增商品
        handleAddSubmit(addProductForm) {
            // 首先检查订单名称是否为空
            if (!addProductForm.productName) {
                this.$message.error("请填写商品名称");
                return;
            }
            // 进行表单验证
            this.$refs.addProductForm.validate((valid) => {
                if (valid) {
                    // 如果表单验证通过，则执行提交操作
                    addProduct(addProductForm)
                        .then((response) => {
                            // 成功保存数据后的操作
                            this.$message.success("提交成功");
                            // 清空表单数据
                            this.resetForm("addProductForm");
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

        // 提交
        handleUploadSubmit(updateForm) {
            updateProduct(updateForm).then(response => {
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

        resetUpdateForm() {
            // 点击重置按钮时，将原始用户信息重新赋值给表单
            this.updateForm = { ...this.originalProductData };
        },
    }
};
</script>
