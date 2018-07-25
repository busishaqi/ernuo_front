import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Table,
  Card,
  Tag,
  Button,
  DatePicker,
  Switch,
  Tooltip,
  Input,
  Popconfirm,
  Form,
  Modal,
  Select,
  TreeSelect
} from "antd";
import { auth } from "../../models/system/auth";
import { Route } from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./import.less";

// 新增权限表单
const Option = Select.Option;
const FormItem = Form.Item;


@connect(({ product, loading }) => ({
  sale_list: product.sale_list,

}))
export default class SaleList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: "",
      modalVisible: false
    };
  }
  componentDidMount = () => {
    this.props.dispatch({
        type: "product/SaleList"
      });
  };
  columns = [
      
    { title: "日期", dataIndex: "shot_date",  },
    {
      title: "产品名称",
      dataIndex: "product_name",
    
    },
    { title: "销售量", dataIndex: "num",  },
    { title: "提成", dataIndex: "user_commission",}
   
  ];

 


  render() {
    const columns = this.columns;
  
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Table
            bordered
            size="middle"
            dataSource= {this.props.sale_list}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
          />
        </Card>
    
      </PageHeaderLayout>
    );
  }
}
