using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MapsProject.Startup))]
namespace MapsProject
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
