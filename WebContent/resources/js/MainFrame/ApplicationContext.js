///////////////////////////////////////////////////////////////////////////////
//功能描述：静态类，公开接口。
//作者：wanghai
//日期：2010-1-8
///////////////////////////////////////////////////////////////////////////////
/*
 * 加命名空间IETM
 */
window.ApplicationContext={
    MainFrame:null,
    UserInfo:new UserManager.UserInfo(),
    // Complexity:new UserManager.PasswordComplexityRule(),
    // ComplexityValidate:new UserManager.PasswordComplexityValidate(),
    FilterService:null,
    CommonService : null,
    Reziser:null   //专用于全屏图片是改变图片大小
};

ApplicationContext.IMainFrame= function()
{
    return this.MainFrame;
};
ApplicationContext.IUserInfo= function()
{
    return this.UserInfo;
};
ApplicationContext.IComplexity= function()
{
    return this.Complexity;
};
ApplicationContext.IComplexityValidate= function()
{
    return this.ComplexityValidate;
};

ApplicationContext.IFilterService= function()
{
    return this.FilterService;
};

ApplicationContext.ICommonService= function()
{
    return Service;
};

ApplicationContext.IIETM= function()
{
    return this.MainFrame.GetActiveTabIETM();
};
