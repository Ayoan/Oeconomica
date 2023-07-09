// import Contact from "@/pages/Contact";
import Oeconomica from '@/pages/Oeconomica';
import Top from "@/pages/Top";
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Top",
      component: Top
    },
    {
      path: "/oeconomica",
      name: "Oeconomica",
      component: Oeconomica
    },
    // {
    //   path: "/contact",
    //   name: "Contact",
    //   component: Contact
    // }
  ]
});