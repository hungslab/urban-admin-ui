<template>
    <div class="app-container">
        <el-card class="box-card">
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                        label-width="68px">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable
                                style="width: 240px" @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable
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

                    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="50" align="center" />
                        <el-table-column label="用户编号" align="center" key="userId" prop="userId"
                            v-if="columns[0].visible" />
                        <el-table-column label="用户名称" align="center" key="userName" prop="userName"
                            v-if="columns[1].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                            v-if="columns[2].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="用户头像" align="center" key="avatar" v-if="columns[3].visible">
                            <template slot-scope="scope">
                                <img :src="scope.row.avatar" style="width: 50px; height: 50px; border-radius: 20%;">
                            </template>
                        </el-table-column>

                        <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                            v-if="columns[4].visible" :show-overflow-tooltip="true" />
                        <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"
                            v-if="columns[5].visible" width="120" />
                        <el-table-column label="邮箱" align="center" key="emali" prop="email" v-if="columns[6].visible"
                            width="120" />

                        <el-table-column label="状态" align="center" key="status" v-if="columns[7].visible">
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.status" active-value="1" inactive-value="0"
                                    @change="handleStatusChange(scope.row)"></el-switch>
                            </template>
                        </el-table-column>

                        <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[8].visible"
                            width="160">
                            <template slot-scope="scope">
                                <span>{{ parseTime(scope.row.createTime) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                            <template slot-scope="scope" v-if="scope.row.userId !== 1">
                                <el-button size="mini" type="text" icon="el-icon-edit"
                                    @click="handleUpdate(scope.row)">修改</el-button>
                                <el-button size="mini" type="text" icon="el-icon-delete"
                                    @click="handleDelete(scope.row)">删除</el-button>
                                <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
                                    <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="handleResetPwd"
                                            icon="el-icon-key">重置密码</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                    </el-table>

                    <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                        :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="pageSizes" />
        </el-card>

        <!-- 新增用户对话框 -->
        <el-dialog :title="增加用户" :visible.sync="open">
            <el-form ref="addUserForm" :model="addUserForm" :rules="rules" label-width="100px">
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="addUserForm.userName" />
                </el-form-item>
                <el-form-item label="用户昵称" prop="nickName">
                    <el-input v-model="addUserForm.nickName" />
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="addUserForm.sex">
                        <el-radio label="男" value="1" />
                        <el-radio label="女" value="0" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号码" prop="phonenumber">
                    <el-input v-model="addUserForm.phonenumber" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserForm.email" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmitUser(addUserForm)">提交</el-button>
                    <el-button @click="resetAddDialogForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog :title="修改用户信息" :visible.sync="updateDialogVisible" width="50%">
            <el-form ref="updateForm" :model="selectedUser" :rules="updateRules" label-width="120px"
                class="update-dialog">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="updateForm.userName" :disabled="true" />
                        </el-form-item>
                        <el-form-item label="部门" prop="department">
                            <el-select v-model="updateForm.deptId" placeholder="请选择">
                                <el-option v-for="(name, deptId) in departments" :key="deptId" :label="name"
                                    :value="deptId" />
                            </el-select>

                        </el-form-item>
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="updateForm.sex">
                                <el-radio label="男" value="1" />
                                <el-radio label="女" value="0" />
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="updateForm.phonenumber" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="updateForm.nickName" />
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="updateForm.email" />
                        </el-form-item>
                        <el-form-item label="状态" prop="status">
                            <el-radio-group v-model="updateForm.status">
                                <el-radio label="正常" value="正常" />
                                <el-radio label="停用" value="停用" />
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="updateForm.remark" />
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
import { listUser, updateUserPwd, delUserById, addUser, updateUser } from "@/api/user";

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
            userList: null,
            // 是否显示弹出层
            open: false,
            
            updateDialogVisible: false,
            updateForm: {
                userName: '',
                userId: '',
                deptId: '',
                nickName: '',
                sex: '',
                phonenumber: '',
                email: '',
                remark: ''
            },
            originalUserData: {}, // 保存原始用户信息的对象
            updateRules: {
                userName: [
                    { message: "用户名称不能为空", trigger: "blur" },
                    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
                ],
                department: [
                    { required: false }
                ],
                nickName: [
                    { message: "用户昵称不能为空", trigger: "blur" }
                ],
                email: [
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ],
                sex: [
                    { required: true, trigger: 'blur', message: '请选择性别' }
                ],
                status: [
                ],
                remark: [
                    { required: false }
                ]
            },
            departments: {
                100: '销售部',
                101: '市场部门',
                102: '技术部门',
                103: '财务部门',
                104: '运维部门'
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                phonenumber: undefined,
                status: undefined
            },
            // 列信息
            columns: [
                { key: 0, label: `用户编号`, visible: true },
                { key: 1, label: `用户名称`, visible: true },
                { key: 2, label: `用户昵称`, visible: true },
                { key: 3, label: `用户头像`, visible: true },
                { key: 4, label: `部门`, visible: true },
                { key: 5, label: `手机号码`, visible: true },
                { key: 6, label: `邮箱`, visible: true },
                { key: 7, label: `状态`, visible: true },
                { key: 8, label: `创建时间`, visible: true }
            ],
            addUserForm: {
                userName: '',
                password: '',
                nickName: '',
                sex: '',
                phonenumber: '',
                email: ''
            },
            // 表单校验
            rules: {
                userName: [
                    { required: true, message: "用户名称不能为空", trigger: "blur" },
                    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: "用户昵称不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" },
                    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
                    { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }
                ],
                email: [
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    watch: {

    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            listUser(this.queryParams).then(response => {
                this.userList = response.data;
                this.loading = false;
            }
            );
        },

        

        
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 用户状态修改
        handleStatusChange(row) {
            let text = row.status === "1" ? "启用" : "停用";
            this.$confirm('确认要' +' ' + text + ' ' + row.userName + ' 用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const data = {
                    userId: row.userId,
                    userName: row.userName,
                    status: row.status == "1" ? "1" : "0"
                }
                updateUser(data).then(() => {
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

        // 表单重置
        reset() {
            this.form = {
                userId: undefined,
                deptId: undefined,
                userName: undefined,
                nickName: undefined,
                password: undefined,
                phonenumber: undefined,
                email: undefined,
                sex: undefined,
                status: "0",
                remark: undefined
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
            this.queryParams.deptId = undefined;
            this.$refs.tree.setCurrentKey(null);
            this.handleQuery();
        },

        // 更多操作触发
        handleCommand(command, row) {
            switch (command) {
                case "handleResetPwd":
                    this.handleResetPwd(row);
                    break;
                default:
                    break;
            }
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

        /** 提交按钮 */
        handleSubmitUser(addUserForm) {
            // 首先检查用户名是否为空
            if (!addUserForm.userName) {
                this.$message.error('请填写用户名称');
                return;
            }
            // 进行表单验证
            this.$refs.addUserForm.validate(valid => {
                if (valid) {
                    // 密码为默认密码
                    addUserForm.password == "123456"
                    // 如果表单验证通过，则执行提交操作
                    addUser(addUserForm).then(response => {
                        // 成功保存数据后的操作
                        this.$message.success('添加成功, 默认密码为：123456');
                        // 清空表单数据
                        this.resetForm('addUserForm');
                        this.getList();
                        // 关闭对话框
                        this.open = false;
                    })
                        .catch(error => {
                            // 处理保存失败的情况
                            this.$message.error('添加失败，请稍后重试');
                        });

                } else {
                    // 如果表单验证失败，则给出相应的提示
                    this.$message.error('表单验证失败，请检查输入');
                    return false;
                }
            });
        },

        handleConfirm(updatForm) {
            // 将前端表单数据转换为符合后端接口要求的数据格式
            const data = {
                userName: updatForm.userName,
                password: updatForm.password,
                nickName: updatForm.nickName,
                sex: updatForm.sex,
                phonenumber: updatForm.phonenumber,
                deptId: updatForm.dept,
                email: updatForm.email
            };

            updateUser(data).then(response => {
                // 处理正常响应
                if (response.status) {
                    this.$message({
                        type: 'success',
                        message: '更新成功!',
                        duration: 200,
                        onClose: () => {
                            this.Updateopen = false; // 关闭编辑对话框
                            // 重新加载表格
                            this.searchAllUser();
                        }
                    });
                } else {
                    // 处理后端返回的错误信息
                    this.$message.error(response.message);
                }
            }).catch(error => {
                // 处理请求过程中的异常
                this.$message.error('更新用户失败，请重试');
                console.error('Update User Error:', error);
            });
        },

        handleUpdate(row) {
            // 设置 updateDialogVisible 为 true，显示修改对话框。
            this.updateDialogVisible = true;
            // 设置 updateForm 对象，用于回显用户信息
            this.updateForm = {
                userName: row.userName,
                userId: row.userId,
                deptId: row.deptId || row.department, // 确保从 row 对象中提取 deptId 或 department 字段
                nickName: row.nickName,
                sex: row.sex,
                phonenumber: row.phonenumber,
                email: row.email,
                remark: row.remark
            };
            // 将最初的用户信息保存到 originalUserData 中
            this.originalUserData = { ...this.updateForm };
        },
        
        handleUpdateSubmit(formData) {
            // 删除不需要的字段
            delete formData.department;
            delete formData.userName;
            // 调用后端 API 更新用户信息
            updateUser(formData)
                .then(response => {
                    // 更新成功后的处理
                    this.$message.success('用户信息更新成功');
                })
                .catch(error => {
                    // 更新失败后的处理
                    this.$message.error('用户信息更新失败');
                });
            this.updateDialogVisible = false;
        },
        resetUpdateForm() {
            // 点击重置按钮时，将原始用户信息重新赋值给表单
            this.updateForm = { ...this.originalUserData };
        },

        // 新增用户表单重置
        resetAddDialogForm() {
            this.addUserForm = {
                userName: '',
                password: '',
                nickName: '',
                sex: '',
                phonenumber: '',
                email: ''
            }
        },
        /** 重置密码按钮操作 */
        handleResetPwd(row) {
            this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                inputPattern: /^.{5,20}$/,
                inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
                inputValidator: (value) => {
                    if (/<|>|"|'|\||\\/.test(value)) {
                        return "不能包含非法字符：< > \" ' \\\ |"
                    }
                },
            }).then(({ value }) => {
                updateUserPwd(row.userId, value).then(response => {
                    this.$message.success("修改成功，新密码是：" + value);
                });
            }).catch(() => { });
        },
    }
};
</script>