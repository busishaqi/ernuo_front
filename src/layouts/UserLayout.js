import React, { Fragment } from "react";
import { Link, Redirect, Switch, Route } from "dva/router";
import DocumentTitle from "react-document-title";
import { Icon } from "antd";
import GlobalFooter from "../components/GlobalFooter";
import styles from "./UserLayout.less";
import logo from "../assets/logo.svg";
import { getRoutes } from "../utils/utils";
import { connect } from "dva";


const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 意尔诺技术小组出品
  </Fragment>
);

class UserLayout extends React.PureComponent {
  state = {
    loginType: "token"
  };
  componentDidMount() {
    this.props.dispatch({
      type: "login/login",
      payload: this.state
    });
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = "YEN";
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - YEN`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>YEN</span>
                </Link>
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

// export default UserLayout;
export default connect(({ login }) => ({
  login
}))(UserLayout);
