<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
    <div style="display: flex;align-items: center;">
      <div style="color: #7296d3; margin-bottom: 12px">选择时间节点：</div>
      <div style="margin-bottom: 12px">
        <el-select  v-model="value" placeholder="请选择时间节点">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @click.native="flterChange(item)"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <!-- <line-chart :chart-data="lineChartData" /> -->
      <bar-chart :year-month="yearMonth" :chart-data="barChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <!-- <bar-chart /> -->
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import LineChart from "./components/LineChart";
import RaddarChart from "./components/RaddarChart";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import TransactionTable from "./components/TransactionTable";
import TodoList from "./components/TodoList";
import BoxCard from "./components/BoxCard";

const lineChartData = {
  newVisitis: {
    expectedData: [
      1040, 1250, 1661, 1834, 1905, 1460, 1625, 4434, 1656, 7266, 8378, 1122,
    ],
    actualData: [120, 82, 91, 154, 162, 140, 145, 433, 435, 322, 655, 322],
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140, 433, 656, 767, 323, 555],
    actualData: [180, 160, 151, 106, 145, 150, 130, 322, 343, 545, 656, 767],
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100, 44, 54, 65, 76, 87],
    actualData: [120, 90, 100, 138, 142, 130, 130, 878, 765, 565, 544, 434],
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160, 43, 545, 65, 76, 76],
    actualData: [120, 82, 91, 154, 162, 140, 130, 323, 434, 545, 656, 767],
  },
};

const barChartData = {
  newVisitis: {
    expectedData: "访问量",
    actualData: [
      3322, 4343, 8234, 3321, 2222, 3232, 9499, 6356, 4334, 8478, 1111, 1221,
    ],
  },
  messages: {
    expectedData: "评价数量",
    actualData: [
      3232, 4343, 5455, 6565, 2332, 4343, 5454, 1221, 3232, 5454, 6565, 7676,
    ],
  },
  purchases: {
    expectedData: "销售额",
    actualData: [
      4343, 6566, 7677, 2121, 3232, 4343, 5465, 4344, 3434, 2323, 4343, 5454,
    ],
  },
  shoppings: {
    expectedData: "支付笔数",
    actualData: [120, 82, 91, 154, 162, 140, 130, 545, 656, 767, 322, 326],
  },
};

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      barChartData: barChartData.newVisitis,
      options: [
        {
          value: "1",
          label: "2024",
        },
        {
          value: "2",
          label: "2023",
        },
        {
          value: "3",
          label: "2022",
        },
        {
          value: "4",
          label: "2021",
        },
        {
          value: "5",
          label: "2020",
        },
      ],
      year:'',
      value: "1",
      newArr : [],
      yearMonth:[]
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
      this.barChartData = barChartData[type];
    },
    // 切换年份
    flterChange(item){
      const arr = ['01','02','03','04','05','06','07','08','09','10','11','12']
      if(item.label != '2024'){
      this.yearMonth =  arr.map((it)=>{
          return this.combineYearAndMonthTemplate(item.label,it);
        })
      }
      else{
        this.getLastYearMonthArray()
      
      }
      console.log(this.yearMonth);
     this.newArr = this.generateRandomNumbers(1000, 2000, 12)
     const newObj = {}
     newObj.expectedData = '销售额'
     newObj.actualData = this.newArr
     this.barChartData = newObj
    },
    combineYearAndMonthTemplate(year, month) {
      return `${year}-${month.toString().padStart(2, '0')}`;
},
    generateRandomNumbers(min, max, count) {
        return Array.from({ length: count }, () =>
          Math.floor(Math.random() * (max - min + 1) + min)
        );
      },
    getLastYearMonthArray(){
        var result = [];
        var d = new Date(); 
        var year = d.getFullYear(); 
        d.setMonth(d.getMonth() + 1, 1); 
        for (var i = 0; i < 12; i++) {
          //开始循环
          d.setMonth(d.getMonth() - 1); 
          var m = d.getMonth() + 1; 
          m = m < 10 ? "0" + m : m;
          result.push(d.getFullYear() + "-" + m); 
        }
        this.yearMonth = result.reverse(); 
      }
  },
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
