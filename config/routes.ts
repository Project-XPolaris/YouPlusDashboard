
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/app',
    name: 'App',
    icon: 'AppstoreOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/app/list',
        name: 'App List',
        component: './App/List',
      },
      {
        path: '/app/create',
        name: 'Create',
        component: './App/Create',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/disk',
    name: 'Disk',
    icon: 'DatabaseOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/disk/list',
        name: 'Disk List',
        component: './Disks/List',
      },
      {
        path: '/disk/:name/info',
        name: 'Disk',
        hideInMenu: true,
        component: './Disks/Detail',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/network',
    name: 'Network',
    icon: 'Link',
    access: 'canAdmin',
    routes: [
      {
        path: '/network/list',
        name: 'Network List',
        component: './Network/List',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/zfs',
    name: 'ZFS',
    icon: 'ClusterOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/zfs/pools',
        name: 'ZFS pools',
        component: './zfs/Pools',
        icon: 'ClusterOutlined',
      },
      {
        path: '/zfs/pool/:name',
        name: 'Pool details',
        hideInMenu: true,
        component: './zfs/Detail',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/storage',
    name: 'Storage',
    icon: 'ContainerOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/storage/list',
        name: 'Storage List',
        component: './Storage/List',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/sharefolder',
    name: 'ShareFolder',
    icon: 'FolderOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/sharefolder/list',
        name: 'List',
        component: './ShareFolder/List',
      },
      {
        path: '/sharefolder/:name',
        name: 'Detail',
        hideInMenu: true,
        component: './ShareFolder/Detail',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account',
    name: 'Account',
    icon: 'UserOutlined',
    access: 'canAdmin',
    routes: [
      {
        path: '/account/list',
        name: 'List',
        component: './Account/List',
      },
      {
        path: '/account/groups',
        name: 'Groups',
        component: './Account/Groups',
      },
      {
        path: '/account/group/:name',
        name: 'GroupDetail',
        component: './Account/GroupDetail',
        hideInMenu: true,
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
