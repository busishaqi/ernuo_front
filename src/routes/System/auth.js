import React, { PureComponent } from "react";
import { connect } from "dva";
import {
  Table,
  Card,
  Tag,
  Button,
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
import styles from "./auth.less";

// 新增权限表单
const Option = Select.Option;
const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, menus } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const getParentMenus = () => {
    let parentMenus = [];
    menus.map(function(item) {
      let tempItem = new Object();
      tempItem.label = item.auth_name;
      tempItem.value = item.id.toString();
      tempItem.key = item.auth_name;
      if (item.hasOwnProperty("children")) {
        tempItem.children = [];
        item.children.map(function(level2Item) {
          let level2TempItem = new Object();
          level2TempItem.label = level2Item.auth_name;
          level2TempItem.value = level2Item.id.toString();
          level2TempItem.key = level2Item.auth_name;
          tempItem.children.push(level2TempItem);
        });
      }
      parentMenus.push(tempItem);
    });
    return parentMenus;
  };
  return (
    <Modal
      title="新建权限"
      maskClosable={false}
      destroyOnClose={true}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="权限名称"
      >
        {form.getFieldDecorator("auth_name", {
          rules: [{ required: true, message: "请输入权限名称" }]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="显示名称"
      >
        {form.getFieldDecorator("show_name", {
          rules: [{ required: true, message: "请输入显示名称" }]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="接口类型"
      >
        {form.getFieldDecorator("auth_type", {
          rules: [{ required: true, message: "请选择权限类型" }],
          initialValue: "接口"
        })(
          <Select style={{ width: 200 }}>
            <Option value="接口">普通接口</Option>
            <Option value="菜单">菜单权限</Option>
            <Option value="界面">界面权限</Option>
            <Option value="界面、接口">界面接口</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="接口类型"
      >
        {form.getFieldDecorator("auth_method", {})(
          <Select
            allowClear
            style={{ width: 200 }}
            placeholder={"权限包含接口时必选"}
          >
            <Option value="GET" selected>
              GET
            </Option>
            <Option value="POST">POST</Option>
            <Option value="PUT">PUT</Option>
            <Option value="DELETE">DELETE</Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="父级权限"
      >
        {form.getFieldDecorator("parent_auth", {})(
          <TreeSelect
            showSearch
            allowClear
            treeNodeFilterProp={"label"}
            style={{ width: 200 }}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={getParentMenus()}
            placeholder="父级权限"
          />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="请求路由"
      >
        {form.getFieldDecorator("auth_route", {})(
          <Input placeholder="权限包含接口时必填" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单路由"
      >
        {form.getFieldDecorator("show_route", {})(
          <Input placeholder="权限是菜单时必填" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="菜单ICON"
      >
        {form.getFieldDecorator("icon", {})(
          <Input placeholder="icon库代码 例如：setting" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="权限描述"
      >
        {form.getFieldDecorator("auth_desc", {})(
          <Input placeholder="随意了" />
        )}
      </FormItem>
    </Modal>
  );
});

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.dataIndex == "auth_type") {
      return (
        <Select style={{ width: 120 }}>
          <Option value="接口" selected>
            接口
          </Option>
          <Option value="菜单">菜单</Option>
          <Option value="界面">界面</Option>
          <Option value="界面、接口">界面接口</Option>
        </Select>
      );
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      // inputType,
      record,
      // index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex]
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@connect(({ auth, loading }) => ({
  authList: auth.authList,
  isGettingAuthList: loading.effects["auth/getAuthList"],
  isChangingAuthStatus: loading.effects["auth/changeAuthStatus"],
  isUpdatingAuth: loading.effects["auth/updateAuth"],
  isAddingAuth: loading.effects["auth/addAuth"]
}))
export default class Auth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: "",
      modalVisible: false
    };
  }
  componentDidMount = () => {
    this.props.dispatch({
      type: "auth/getAuthList"
    });
  };
  columns = [
    { title: "权限名称", dataIndex: "auth_name", width: 200, editable: true },
    {
      title: "操作",
      key: "operation",
      width: 100,
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.id)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="确定取消?"
                  onConfirm={() => this.cancel(record.id)}
                >
                  <a>取消</a>
                </Popconfirm>
              </span>
            ) : (
              <Tooltip
                placement="top"
                title="编辑"
                onClick={() => this.edit(record.id)}
                arrowPointAtCenter
              >
                <Button shape="circle" icon="edit" />
              </Tooltip>
            )}
          </div>
        );
      }
    },
    {
      title: "权限状态",
      dataIndex: "status",
      width: 100,
      render: (status, record) => {
        return (
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={this.authSwtichChecked(status)}
            loading={this.props.isChangingAuthStatus}
            onChange={this.authSwitchChange.bind(this, record.id)}
          />
        );
      }
    },
    {
      title: "权限类型",
      dataIndex: "auth_type",
      width: 200,
      editable: true,
      render: text => {
        return <Tag color={this.getTypeColor(text)}>{text}</Tag>;
      }
    },
    { title: "请求方式", dataIndex: "auth_method", width: 200, editable: true },
    { title: "菜单名称", dataIndex: "show_name", width: 200, editable: true },
    { title: "菜单路由", dataIndex: "show_route", width: 200, editable: true },
    { title: "菜单图标", dataIndex: "icon", width: 200, editable: true },
    { title: "权限描述", dataIndex: "auth_desc", width: 200, editable: true }
  ];
  //根据权限类型获取标签对应颜色
  getTypeColor = type => {
    if (type === "接口") {
      return "blue";
    } else if (type === "菜单") {
      return "magenta";
    } else {
      return "purple";
    }
  };
  //权限状态展示
  authSwtichChecked = status => {
    return status == 1 ? true : false;
  };
  //权限状态变更
  authSwitchChange = (authID, status) => {
    status = !status ? 0 : 1;
    this.props.dispatch({
      type: "auth/changeAuthStatus",
      params: {
        authID: authID,
        status: status
      }
    });
  };
  isEditing = record => {
    return record.id === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const params = {
        authID: key
      };
      const payload = row;
      this.props.dispatch({
        type: "auth/updateAuth",
        params: params,
        payload: payload
      });
      this.setState({ editingKey: "" });
    });
  }
  cancel = () => {
    this.setState({ editingKey: "" });
  };

  handleAdd = values => {
    const payload = values;
    this.props.dispatch({
      type: "auth/addAuth",
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
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible
    };

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
            components={components}
            loading={
              this.props.isGettingAuthList ||
              this.props.isUpdatingAuth ||
              this.props.isAddingAuth
            }
            bordered
            size="middle"
            dataSource={this.props.authList}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
            scroll={{ x: 1600, y: 500 }}
          />
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={this.state.modalVisible}
          menus={this.props.authList}
        />
      </PageHeaderLayout>
    );
  }
}
