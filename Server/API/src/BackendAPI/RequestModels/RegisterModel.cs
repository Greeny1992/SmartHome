using Context.DAL;

namespace BackendAPI.RequestModels
{
    public class RegisterModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public Role Role { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime validTill { get; set; }
    }
}
