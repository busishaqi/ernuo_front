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
  Tree
} from "antd";
import { role } from "../../models/system/role";
import { Route } from "dva/router";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./auth.less";

// 新增角色表单
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const CreateForm = Form.create()(props => {
  this.state = {
    auth_list: []
  };

  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    roleInfo,
    authList
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.auth_list = this.state.auth_list;
      fieldsValue.id = getRoleInfo("id");
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const title = () => {
    return roleInfo == null ? "新增角色" : "编辑角色";
  };

  const onCheck = val => {
    // console.log(val);
    // val.push.apply(val, event.halfCheckedKeys);
    this.state.auth_list = val.checked;
    console.log(this.state.auth_list);
  };

  const getRoleInfo = key => {
    if (roleInfo == null) {
      return;
    }
    return roleInfo[key];
  };

  const getRoleAuthList = () => {
    if (roleInfo == null) {
      return [];
    }
    // const auth_list = roleInfo['auth_list'];
    let tempAuthList = [];

    roleInfo["auth_list"].map(function(item) {
      tempAuthList.push(item + "");
    });
    this.state.auth_list = tempAuthList;
  };

  //获取权限选择组件内容
  const getAuthListItem = () => {
    getRoleAuthList();
    return (
      <Tree
        checkable={true}
        checkStrictly={true}
        onCheck={onCheck}
        defaultCheckedKeys={this.state.auth_list}
      >
        {authList.map(data => (
          <TreeNode
            title={"【" + data.auth_type + "】" + data.auth_name}
            key={data.id}
          >
            {data.children
              ? data.children.map(item => (
                  <TreeNode
                    title={"【" + item.auth_type + "】" + item.auth_name}
                    key={item.id}
                  >
                    {item.children
                      ? item.children.map(level2Item => (
                          <TreeNode
                            title={
                              "【" +
                              level2Item.auth_type +
                              "】" +
                              level2Item.auth_name
                            }
                            key={level2Item.id}
                          />
                        ))
                      : ""}
                  </TreeNode>
                ))
              : ""}
          </TreeNode>
        ))}
      </Tree>
    );
  };

  return (
    <Modal
      width={600}
      title={title()}
      maskClosable={false}
      destroyOnClose={true}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色名称"
      >
        {form.getFieldDecorator("role_name", {
          rules: [{ required: true, message: "请输入角色名称" }],
          initialValue: getRoleInfo("role_name")
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="角色描述"
      >
        {form.getFieldDecorator("role_desc", {
          initialValue: getRoleInfo("role_desc")
        })(<Input placeholder="随意了" />)}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="权限列表"
      >
        {form.getFieldDecorator("auth_list", {})(getAuthListItem())}
      </FormItem>
    </Modal>
  );
});

@connect(({ auth, role, loading }) => ({
  roleList: role.roleList,
  authList: auth.authList,
  isGettingAuthList: loading.effects["auth/getAuthList"],
  isGettingRoleList: loading.effects["role/getRoleList"],
  isChangingRoleStatus: loading.effects["role/changeRoleStatus"]
  // isUpdatingAuth: loading.effects['auth/updateAuth'],
  // isAddingAuth: loading.effects['auth/addAuth']
}))
export default class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      roleInfo: null
    };
  }
  componentDidMount = () => {
    this.props.dispatch({
      type: "role/getRoleList"
    });
    this.props.dispatch({
      type: "auth/getAuthList"
    });
  };
  columns = [
    { title: "角色名称", dataIndex: "role_name", width: 200 },
    { title: "角色描述", dataIndex: "role_desc", width: 200 },
    {
      title: "角色状态",
      dataIndex: "status",
      width: 100,
      render: (status, record) => {
        return (
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={this.roleSwtichChecked(status)}
            loading={this.props.isChangingRoleStatus}
            onChange={this.roleSwitchChange.bind(this, record.id)}
          />
        );
      }
    },
    {
      title: "操作",
      key: "operation",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            {
              <Tooltip
                placement="top"
                title="编辑"
                onClick={() => this.handleModalVisible(true, record.id)}
                arrowPointAtCenter
              >
                <Button shape="circle" icon="edit" />
              </Tooltip>
            }
          </div>
        );
      }
    }
  ];

  //权限状态展示
  roleSwtichChecked = status => {
    return status == 1 ? true : false;
  };
  //权限状态变更
  roleSwitchChange = (authID, status) => {
    status = !status ? 0 : 1;
    this.props.dispatch({
      type: "role/changeRoleStatus",
      params: {
        authID: authID
      },
      payload: {
        status: status
      }
    });
  };

  handleAdd = values => {
    const payload = values;
    this.props.dispatch({
      type: "role/addRole",
      payload: payload
    });
    this.setState({
      modalVisible: false
    });
  };

  handleModalVisible = (flag, rowID) => {
    const roles = this.props.roleList;
    let roleInfo = null;
    roles.map(function(item) {
      if (item.id == rowID) {
        roleInfo = item;
      }
    });
    // if (roleInfo == null) {
    //   notification.error({
    //     message: '不存在该角色'
    //   });
    //   return;
    // }
    this.setState({
      modalVisible: !!flag,
      roleInfo: roleInfo
    });
  };

  render() {
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
            onClick={() => this.handleModalVisible(true, 0)}
          >
            新建角色
          </Button>
          <Table
            loading={this.props.isGettingRoleList}
            bordered
            size="middle"
            dataSource={this.props.roleList}
            columns={this.columns}
            rowKey="id"
          />
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={this.state.modalVisible}
          roleInfo={this.state.roleInfo}
          authList={this.props.authList}
        />
      </PageHeaderLayout>
    );
  }
}
