using Context;
using Context.DAL;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnitTest
{
    public class UserUnitTest : BaseUnitTests
    {
        [Test]
        public async Task CreateUser()
        {
            User user = new User();
            user.UserName = "georg@georg.at";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Georg";
            user.Lastname = "Prassl";

            User returnval = await MongoUoW.Users.InsertOneAsync(user);

            Assert.NotNull(returnval);
        }


        [Test]
        public async Task CreateUserAndChange()
        {
            User user = new User();
            user.UserName = "georg@georg.at";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Password = "123456";
            user.Firstname = "Georg";
            user.Lastname = "Prassl";

            await MongoUoW.Users.InsertOneAsync(user);

            user.Firstname = "Georg2";

            await MongoUoW.Users.UpdateOneAsync(user);
        }

        [Test]
        public async Task LoginTest()
        {
            String user = "georg@georg.at";
            String password = "123456";

            User usr = await MongoUoW.Users.Login(user, password);

            Assert.NotNull(usr);
        }


       
        [Test]
        public async Task LoginFailedTest()
        {
            String user = "georg@georg.at";
            String password = "123457";

            User usr = await MongoUoW.Users.Login(user, password);

            Assert.IsNull(usr);
        }
    }
}
