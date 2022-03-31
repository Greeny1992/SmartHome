using BackendAPI.RequestModels;
using BackendAPI.ResponseModels;
using Context;
using Context.DAL;
using Context.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        MongoDBUnitOfWork mongo = MonitoringFacade.Instance.MongoDB;
        Authentication auth = MonitoringFacade.Instance.Authentication;

        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginCredentials cred)
        {


            User usr = await mongo.User.Login(cred.Username, cred.Password);
            AuthenticationInformation token = await auth.Authenticate(usr);

            if (token != null)
            {
                LoginResponse returnmodel = new LoginResponse();
                returnmodel.User = usr;
                returnmodel.AuthenticationInformation = token;
                return returnmodel;
            }

            return Unauthorized();
        }

        [HttpPost("Register")]
        public async Task<ActionResult<User>> Register([FromBody] RegisterModel cred)
        {
            User user = new User();
            user.UserName = cred.UserName;
            user.Role = cred.Role;
            user.ValidTill = cred.validTill;
            user.Password = cred.Password;
            user.Firstname = cred.FirstName;
            user.Lastname = cred.LastName;

            return await mongo.User.InsertOrUpdateOneAsync(user);
        }


    }
}
