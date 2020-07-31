<template>
    <div class="Home">
        <!--搜索栏-->
        <el-row>
            <el-col :span="24">
                <div class="grid-content ">
                    <div>
                        <el-input placeholder="请输入内容" v-model.trim="search" @keyup.enter.native="getUser(1)">
                            <el-button slot="append" icon="el-icon-search" @click="getUser(1)"></el-button>
                        </el-input>
                    </div>
                    <div>
                        <el-button type="default" :disabled="disabled">
                            <json-excel
                            :fields="json_fields"
                            :data="multipleSelection"
                            :name="xlsName"
                            :before-generate="startDownload"
                            :before-finish="finishDownload"
                            type="xls">
                                <span>导出</span>
                            </json-excel>
                        </el-button>
                        <el-button type="primary" @click="btnAddEdit('add')">添加</el-button>
                        <el-button type="danger" :disabled="disabled" @click="deleteUser()">批量删除</el-button>
                    </div>
                
                </div>
            </el-col>
        </el-row>
        <!--表格数据-->
        <el-table
        ref="multipleTable"
        :data="dataList"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        border
        stripe
        :header-cell-style="textAlign"
        :cell-style="textAlign"
        @selection-change="handleSelectionChange"
        style="width: 100%">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="name"
            label="姓名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="address"
            label="地址">
            </el-table-column>
            <el-table-column
            label="操作"
            width="180">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="btnAddEdit('edit',scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteUser(scope.row.id,dataList[scope.$index])">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageNo"
        @size-change="handleSizeChange"
        :page-sizes="[10,100, 200, 500, 1000]"
        @current-change="currentChange"
        :total="total">
        </el-pagination>
        <!--添加修改弹框-->
        <el-dialog :title="addEditStatus==='add'?'添加':'修改'" :visible.sync="dialogFormVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
        >
            <el-form :model="form">
                <el-form-item label="部门名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="部门地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
            
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="btnSubmit">确 定</el-button>
            </div>
        </el-dialog>
    
    </div>
</template>

<script>
    import utils from './../assets/js/utils'
    import JsonExcel from 'vue-json-excel'
    export default {
        data() {
            return {
                loading: true,
                search: '',
                dataList: [],
                dialogFormVisible: false,
                form: {},
                formLabelWidth: '120px',
                addEditStatus: '',
                pageNo: 1,
                pageSize: 10,
                total: 0,
                disabled: true,
                xlsName: 'data.xls',
                searchWatch: false,
                multipleSelection: [],
                json_fields: {
                    '部门名称': 'name',
                    '部门地址': 'address'
                },
            }
        },
        components: {
            JsonExcel
        },
        mounted() {
            this.getUser()
        },
        methods: {
            startDownload() {
                const date = new Date()
                console.log('开始', Date.now())
                this.xlsName = `部门${utils.formatDate(date, 2)}.xls`
            },
            finishDownload() {
                console.log('完成', Date.now())
                this.$message({
                    message: '数据导出成功',
                    type: 'success'
                })
            },
            textAlign() {
                return 'text-align:center'
            },
            btnSubmit() {
                // console.log(this.form)
                let url = this.addEditStatus === 'add' ? '/department/add' : '/department/update'
                this.$post(url, this.form).then(res => {
                    if (res.code === 0) {
                        this.dialogFormVisible = false
                        this.pageNo = 1
                        this.getUser()
                    }
                    this.$message({
                        type: res.code === 0 ? 'success' : 'error',
                        message: res.message
                    });
                })

            },
            getUser(pageNo = 1, pageSize = 10) {
                console.log(this.loading)
                if (this.searchWatch) {
                    pageNo = 1
                }
                this.pageNo = pageNo
                this.pageSize = pageSize
                this.searchWatch = false
                console.log('pageNo', pageNo)
                console.log('pageSize', pageSize)
                console.log('this.search', this.search)
                let url = `/department?pageNo=${pageNo}&pageSize=${pageSize}`
                if (this.search) {
                    url += `&search=${this.search}`
                }
                this.$get(url).then(res => {
                    this.loading = false
                    this.total = res.data.total
                    this.dataList = res.data.list
                }).catch(err => {
                    this.loading = false
                })
            },
            deleteUser(id, index) {
                console.log(id)
                console.log(index)
                if (index) {
                    this.$refs.multipleTable.clearSelection()
                    this.$refs.multipleTable.toggleRowSelection(index)
                }
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        // ids: this.multipleSelection.map(item => item.id).join()
                        ids: this.multipleSelection.map(item => item.id)
                    }

                    this.$post(`/department/delete`, params).then(res => {
                        console.log(res)
                        if (res.code === 0) {
                            this.pageNo = 1
                            this.getUser(1, this.pageSize)
                        }
                        this.$message({
                            type: res.code === 0 ? 'success' : 'error',
                            message: res.message
                        });
                    })
                }).catch(() => {
                    console.log('取消删除')
                });

            },
            btnAddEdit(type, id) {
                console.log(type)
                this.form = {}
                this.addEditStatus = type
                if (type === 'add') {
                    this.dialogFormVisible = true
                } else {
                    this.getId(id)
                }
            },
            getId(id) {
                console.log(id)
                this.$get(`/department/getId?id=${id}`).then(res => {
                    this.form = res.data
                    this.dialogFormVisible = true
                }).catch(err => {
                    console.log(err)
                })

            },
            handleSelectionChange(val) {
                this.multipleSelection = val
                this.disabled = !val.length
                console.log('this.multipleSelection', this.multipleSelection)
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize = val
                this.getUser(1, val)
            },
            currentChange(curr) {
                console.log('curr', curr)
                this.pageNo = curr
                this.getUser(curr, this.pageSize)
            }
        },
        
        watch: {
            search() {
                this.searchWatch = true
            }
        }
    }
</script>
<style lang="less" scoped>
    .Home {
        padding: 15px;
        .grid-content {
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
        }
        .el-pagination {
            margin: 10px auto;
        }
    }
</style>
