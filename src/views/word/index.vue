<template>
    <div class="app-container">
        <el-card class="box-card">
            <!-- <doc-alert title="敏感词" url="https://doc.iocoder.cn/sensitive-word" /> -->
            <!-- 搜索工作栏 -->
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="68px">
                <el-form-item label="敏感词" prop="name">
                    <el-input v-model="queryParams.name" placeholder="请输入敏感词" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="标签" prop="tag">
                    <el-select v-model="queryParams.tag" placeholder="请选择标签" clearable @keyup.enter.native="handleQuery">
                        <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <!-- <el-select v-model="queryParams.status" placeholder="请选择启用状态" clearable>
                <el-option v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                        :key="dict.value" :label="dict.label" :value="dict.value"/>
            </el-select> -->
                </el-form-item>
                <el-form-item label="创建时间" prop="createTime">
                    <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 操作工具栏 -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                        v-hasPermi="['system:sensitive-word:create']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                        :loading="exportLoading" v-hasPermi="['system:sensitive-word:export']">导出</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-document-checked" size="mini"
                        @click="handleTest">测试</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
            </el-row>

            <!-- 列表 -->
            <el-table v-loading="loading" :data="list">
                <el-table-column label="编号" align="center" prop="id" />
                <el-table-column label="敏感词" align="center" prop="name" />
                <el-table-column label="状态" align="center" prop="status">
                    <!-- <template v-slot="scope">
                <dict-tag :type="DICT_TYPE.COMMON_STATUS" :value="scope.row.status"/>
            </template> -->
                </el-table-column>
                <el-table-column label="描述" align="center" prop="description" />
                <el-table-column label="标签" align="center" prop="tags">
                    <template v-slot="scope">
                        <el-tag :disable-transitions="true" :key="index" v-for="(tag, index) in scope.row.tags"
                            :index="index">
                            {{ tag }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                    <template v-slot="scope">
                        <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template v-slot="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                            v-hasPermi="['system:sensitive-word:update']">修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                            v-hasPermi="['system:sensitive-word:delete']">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                            :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="pageSizes"
                            :total="this.total" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </el-card>
        

        <!-- 对话框(添加 / 修改) -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="敏感词" prop="name">
                    <el-input v-model="form.name" placeholder="请输入敏感词" />
                </el-form-item>
                <!-- <el-form-item label="状态"> -->
                    <!-- <el-radio-group v-model="form.status">
              <el-radio v-for="dict in this.getDictDatas(DICT_TYPE.COMMON_STATUS)"
                        :key="dict.value" :label="parseInt(dict.value)">{{dict.label}}</el-radio>
            </el-radio-group> -->
                <!-- </el-form-item> -->
                <el-form-item label="备注" prop="description">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-select v-model="form.tags" multiple filterable allow-create placeholder="请选择文章标签"
                        style="width: 380px">
                        <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 对话框(测试敏感词) -->
        <el-dialog title="检测敏感词" :visible.sync="testOpen" width="500px" append-to-body>
            <el-form ref="testForm" :model="testForm" :rules="testRules" label-width="80px">
                <el-form-item label="文本" prop="text">
                    <el-input type="textarea" v-model="testForm.text" placeholder="请输入测试文本" />
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-select v-model="testForm.tags" multiple placeholder="请选择标签" style="width: 380px">
                        <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitTestForm">检 测</el-button>
                <el-button @click="cancelTest">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fromTextArea } from 'codemirror';


export default {
    name: "SystemSensitiveWord",
    data() {
        return {
            // 遮罩层
            loading: false,
            // 导出遮罩层
            exportLoading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 敏感词列表
            list: [
                {
                    name: "脏话",
                    tags: ["全局"],
                    status: 0,
                    description: null,
                    id: this.generateUUID(),
                    createTime: new Date(),
                },
                {
                    name: "博彩",
                    tags: ["评价"],
                    status: 0,
                    description: null,
                    id: this.generateUUID(),
                    createTime: new Date(),
                },
                
                {
                    name: "土豆",
                    tags: ["留言", "短信"],
                    status: 0,
                    description: "好呀",
                    id: this.generateUUID(),
                    createTime: new Date(),
                },
                {
                    name: "XXX",
                    tags: ["短信"],
                    status: 0,
                    description: null,
                    id: this.generateUUID(),
                    createTime: new Date(),
                },
                {
                    name: "ccc",
                    tags: ["测试"],
                    status: 0,
                    description: null,
                    id: this.generateUUID(),
                    createTime: new Date(),
                },
            ],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            testOpen: false,
            tags: ['测试', '短信', '留言', '评价', '全局'],
            // 查询参数
            queryParams: {
                pageNo: 1,
                pageSize: 10,
                name: null,
                tag: null,
                createTime: [],
            },
            // 表单参数
            form: {},
            // 表单参数
            testForm: { tags: ['标签1', '标签2', '标签3', '标签4', '标签5'] },
            // 表单校验
            rules: {
                name: [{ required: true, message: "敏感词不能为空", trigger: "blur" }],
                tags: [{ required: false, message: "标签不能为空", trigger: "blur" }],
            },
            testRules: {
                text: [
                    { required: true, message: "测试文本不能为空", trigger: "blur" },
                ],
            },
        };
    },
    created() {
        //   this.getTags();
        //   this.getList();
    },
    methods: {
        /** 初始化标签select*/
        getTags() {
            // getSensitiveWordTags().then(response => {
            //   this.tags = response.data;
            // });
        },
        /** 查询列表 */
        getList() {
            //   this.loading = true;
            //   // 执行查询
            //   getSensitiveWordPage(this.queryParams).then((response) => {
            //     this.list = response.data.list;
            //     this.total = response.data.total;
            //     this.loading = false;
            //   });
        },
        /** 取消按钮 */
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 取消按钮 */
        cancelTest() {
            this.resetTest();
        },
         generateUUID() {
            return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },


        /** 表单重置 */
        reset() {
            const CommonStatusEnum = {
                ENABLE: 0, // 开启
                DISABLE: 1, // 禁用
            };
            this.form = {
                id: undefined,
                name: undefined,
                description: undefined,
                createTime: new Date(),
                tags: undefined,
                status: CommonStatusEnum.ENABLE,
            };
            this.resetForm("form");
        },
        /** 表单重置 */
        resetTest() {
            this.testForm = {
                text: undefined,
                tags: undefined,
            };
            this.resetForm("testForm");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNo = 1;
            // this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加敏感词";
        },
        /** 测试敏感词按钮操作 */
        handleTest() {
            this.resetTest();
            this.testOpen = true;
            this.titleTest = "检测文本是否含有敏感词";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id;
            //   getSensitiveWord(id).then((response) => {
            this.form = row;
            this.open = true;
            this.title = "修改敏感词";
            //   });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate((valid) => {
                if (!valid) {
                    return;
                }
                // 修改的提交
                if (this.form.id != null) {
                    const newData = this.list.map((item) => {
                        if (item.id == this.form.id) {
                            item.name = this.form.name
                        }
                    })


                    //   updateSensitiveWord(this.form)
                    // .then((response) => {
                    this.$message.success("修改成功");
                    this.open = false;
                    //   this.getList();
                    // })
                    // .catch((err) => {});
                    return;
                }
                // 添加的提交
                // createSensitiveWord(this.form)
                //   .then((response) => {
                this.form.id = this.generateUUID();
                this.list.push(this.form)
                this.$message.success("新增成功");
                this.open = false;
                // this.getList();
                //   })
                //   .catch((err) => {});
            });
        },

        /** 测试文本2提交按钮 */
        submitTestForm() {
            this.$refs["testForm"].validate((valid) => {
                if (!valid) {
                    return;
                }
                validateText(this.testForm).then((response) => {
                    if (response.data.length === 0) {
                        this.$modal.msgSuccess("不包含敏感词！");
                        return;
                    }
                    this.$modal.msgWarning("包含敏感词：" + response.data.join(", "));
                });
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const id = row.id;
            this.$confirm('是否确认删除敏感词编号为"' + id + '"的数据项?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning"
            }).then(function () {
                //   return deleteSensitiveWord(id);
            })
                .then(() => {
                    //this.getList();
                    this.list = this.list.filter((item) => {
                        return item.id !== id
                    })
                    this.$message.success("删除成功");
                })
                .catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            // 处理查询参数
            let params = { ...this.queryParams };
            params.pageNo = undefined;
            params.pageSize = undefined;
            // 执行导出
            this.$modal
                .confirm("是否确认导出所有敏感词数据项?")
                .then(() => {
                    this.exportLoading = true;
                    return exportSensitiveWordExcel(params);
                })
                .then((response) => {
                    this.$download.excel(response, "${table.classComment}.xls");
                    this.exportLoading = false;
                })
                .catch(() => { });
        },
    },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.el-tag+.el-tag {
    margin-left: 10px;
}
</style>
