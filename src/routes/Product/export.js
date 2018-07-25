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
const CreateForm = Form.create()(props => {
  const { modalVisible, form,handleAdd, handleModalVisible, menus } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (fieldsValue.shot_date!=undefined&&fieldsValue.shot_date!="") {
         fieldsValue.shot_date = '20181010';
      }
     handleAdd(fieldsValue);
    });
  };
 
  return (
    <Modal
      title="出库操作"
      maskClosable={false}
      destroyOnClose={true}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
     <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="产品名称"
      >
        {form.getFieldDecorator("product_id", {
          rules: [{ required: true, message: "产品名称" }],
          initialValue: "产品名称"
        })(
          <Select style={{ width: 200 }}>
            <Option value="1">火马1</Option>
            <Option value="2">火马2</Option>
            <Option value="3">火马3</Option>
            <Option value="4">火马4</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="产品类型"
      >
        {form.getFieldDecorator("type", {
          rules: [{ required: true, message: "请选择产品类型" }],
          initialValue: "公司产品"
        })(
          <Select style={{ width: 200 }}>
            <Option value="1">公司产品</Option>
            <Option value="2">会员产品</Option>
          </Select>
        )}
      </FormItem>
      <FormItem  labelCol={{ span: 5 }}
       wrapperCol={{ span: 15 }}
      label="出库库日期"
     >
      {form.getFieldDecorator("shot_date", {
        rules: [{ required: true, message: "请选择出库日期" }],
      })(<DatePicker style={{ width: '100%' }}  />)}
            </FormItem>

      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="成本单价"
      >
        {form.getFieldDecorator("cost_price", {
          rules: [{ required: true, message: "成本单价" }]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="出库单价"
      >
        {form.getFieldDecorator("price", {
          rules: [{ required: true, message: "出库单价" }]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="出库的数量"
      >
        {form.getFieldDecorator("num", {})(
          <Input placeholder="入库的数量" />
        )}
      </FormItem>
     
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="业务员"
      >
        {form.getFieldDecorator("sale_id", {})(
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder={"必须要选择入库的销售或者是会员人员"}
          >
            <Option value="1" selected>
             小红
            </Option>
            <Option value="2">小花</Option>
            <Option value="3">小蓝</Option>
            <Option value="4">小李</Option>
          </Select>
        )}
      </FormItem>
    
    </Modal>
  );
});

const FormItem = Form.Item;


@connect(({ product, loading }) => ({
  exportData:  product.exportData,
  exportList: product.exportList,

}))
export default class exportProduct extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: "",
      modalVisible: false
    };
  }
  componentDidMount = () => {
    this.props.dispatch({
        type: "product/exportProductList"
      });
  };
  columns = [
      
    { title: "日期", dataIndex: "shot_date",  },
    {
      title: "产品名称",
      dataIndex: "product_id",
    
    },
    {
      title: "产品的类型",
      dataIndex: "type",
    
    },
    { title: "入库人员", dataIndex: "sale_id" },
    { title: "产品的库存", dataIndex: "num",  },
    { title: "成本单价", dataIndex: "cost_price",}
   
  ];

  handleAdd  =values=> {
    const payload = values;
    this.props.dispatch({
     type: "product/exportProduct",
      payload: payload
    });
    this.setState({
      modalVisible: false
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };
  render() {
    const columns = this.columns;
    const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible
      };
      //console.log(this.importList);


    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Button
            className={styles.button}
            icon="plus"
            type="primary"
            onClick={() => this.handleModalVisible(true)}
          >
            新建
          </Button>
          <Table
          //  components={components}
            bordered
            size="middle"
            dataSource= {this.props.exportList}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
          />
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={this.state.modalVisible}
       
        />
      </PageHeaderLayout>
    );
  }
}
