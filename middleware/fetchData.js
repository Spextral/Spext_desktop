export default ({ store }) => Promise.all([store.dispatch('user/getUserInfo')])
