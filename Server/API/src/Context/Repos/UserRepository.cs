using Context.DAL;
using Context.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.Repos
{
    public class UserRepository : MongoRepository<User>, IUserRepository
    {
        public UserRepository(MongoDBContext Context) : base(Context)
        {
        }

        public Task<User> Login(string username, string password)
        {
            throw new NotImplementedException();
        }
    }
}
