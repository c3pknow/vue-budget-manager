import Axios from "axios";
import router from "@/router";

const BudgetManagerAPI = `http://${window.location.hostname}:3001`;

export default {
  user: { authenticated: false },

  authenticate(context, credentials, redirect) {
    Axios.post(`${BudgetManagerAPI}/api/v1/auth`, credentials)
      .then(({ data }) => {
        context.$cookie.set("token", data.token, "1D");
        // eslint-disable-next-line
        context.$cookie.set('user_id', data.user._id, '1D');
        // eslint-disable-next-line
        context.validLogin = true;
        this.user.authenticated = true;
        router.push("/");
        if (redirect) router.push(redirect);
      })
      .catch(({ response: { data } }) => {
        // eslint-disable-next-line
        context.snackbar = true;
        // eslint-disable-next-line
        context.message = data.message;
      });
  },

  signup(context, credentials, redirect) {
    Axios.post(`${BudgetManagerAPI}/api/v1/signup`, credentials)
      .then(() => {
        // eslint-disable-next-line
        context.validSignUp = true;

        this.authenticate(context, credentials, redirect);
      })
      .catch(({ response: { data } }) => {
        // eslint-disable-next-line
        context.snackbar = true;
        // eslint-disable-next-line
        context.message = data.message;
      });
  },

  signout(context, redirect) {
    context.$cookie.delete("token");
    context.$cookie.delete("user_id");
    this.user.authenticated = false;

    if (redirect) router.push(redirect);
  },

  checkAuthentication() {
    const token = document.cookie;
    this.user.authenticated = !!token;
  },

  getAuthenticationHeader(context) {
    return `Bearer ${context.$cookie.get("token")}`;
  },
};
