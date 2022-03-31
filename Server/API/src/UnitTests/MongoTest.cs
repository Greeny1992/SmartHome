using Context.DAL;
using Context.DAL.Data;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
using Utilities;

namespace UnitTests
{
    public class MongoTest : BaseUnitTests
    {

        [Test]
        public async Task TestConnect()
        {
            Assert.IsTrue(MongoContext.IsConnected);
        }

        [Test]
        public async Task CreateAndDeleteDataPoint()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            Assert.NotNull(pt);
            Assert.NotNull(pt.ID);

            await MongoUoW.DataPoints.DeleteByIdAsync(pt.ID);

            var res = await MongoUoW.DataPoints.FindByIdAsync(pt.ID);

            Assert.IsNull(res);
        }

        [Test] 
        public async Task UpdateDataPoint()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            Assert.NotNull(pt);
            Assert.NotNull(pt.ID);

            pt.Name = "Updated Name";
            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            var res = await MongoUoW.DataPoints.FindByIdAsync(pt.ID);
            Assert.AreEqual(res.Name, "Updated Name");

            await MongoUoW.DataPoints.DeleteByIdAsync(res.ID);
        }

        [Test]
        public async Task FindOneDataPoint()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            Assert.NotNull(pt);
            Assert.NotNull(pt.ID);

            var res = await MongoUoW.DataPoints.FindOneAsync(filter => filter.Name == "Erster Test");
            Assert.NotNull(res);
            await MongoUoW.DataPoints.DeleteOneAsync(filter => filter.ID == res.ID);
        }

        [Test]
        public async Task FilterDataPoint()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";

            DataPoint pt2 = new DataPoint();
            pt2.DataType = DataType.Float;
            pt2.Description = "Erster Test";
            pt2.Name = "Erster Test";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt2);

            DataPoint pt3 = new DataPoint();
            pt3.DataType = DataType.Boolean;
            pt3.Description = "Zweiter Test";
            pt3.Name = "Zweiter Test";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt3);

            var res = MongoUoW.DataPoints.FilterBy(filter => filter.DataType == DataType.Float);
            foreach (var dp in res)
            {
                Assert.AreEqual(dp.Name, "Erster Test");
            }


            await MongoUoW.DataPoints.DeleteManyAsync(filter => filter.Name == "Erster Test" || filter.Name == "Zweiter Test");

            Assert.IsNull(await MongoUoW.DataPoints.FindByIdAsync(pt.ID));
        }

        [Test]
        public async Task FindByDBName()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";
            pt.DatabaseName = "DBNameTest";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            Assert.NotNull(pt);
            Assert.NotNull(pt.ID);

            var res = await MongoUoW.DataPoints.FindByDataBaseName("DBNameTest");
            Assert.NotNull(res);
            await MongoUoW.DataPoints.DeleteOneAsync(filter => filter.ID == res.ID);
        }

        [Test]
        public async Task TestAddVisual()
        {
            DataPoint pt = new DataPoint();
            pt.DataType = DataType.Float;
            pt.Description = "Erster Test";
            pt.Name = "Erster Test";
            pt.DatabaseName = "DBNameTest";

            await MongoUoW.DataPoints.InsertOrUpdateOneAsync(pt);
            Assert.NotNull(pt);
            Assert.NotNull(pt.ID);

            DataPointVisual testVisual = new DataPointVisual();
            testVisual.Name = "Test Name Visual";
            testVisual.Description = "Test Description";
            
            //await MongoUoW.DataPoints.AddVisualToDataPoint(testVisual, pt);

            var res = await MongoUoW.DataPoints.FindByDataBaseName("DBNameTest");
            //Assert.AreEqual(res.Internal_Visual, testVisual);
            await MongoUoW.DataPoints.DeleteOneAsync(filter => filter.ID == res.ID);
        }

        [Test]
        public async Task TestCreateUser()
        {
            User user = new User();
            user.UserName = "TestUserName";
            user.Password = "PlainPassword";
            user.Role = Role.Admin;
            user.ValidTill = DateTime.MaxValue;
            user.Firstname = "Schorsch";
            user.Lastname = "P";

            User user2 = await MongoUoW.User.InsertOrUpdateOneAsync(user);
            Assert.NotNull(user2);
            Assert.AreNotEqual(user.Password, user2.HashedPassword);
        }

        [Test]
        public async Task TestLogin()
        {

            User u = await MongoUoW.User.Login("TestUserName", "PlainPassword");

            Assert.IsNotNull(u);
        }

        [Test]
        public async Task TestLoginFail()
        {

            User u = await MongoUoW.User.Login("TestUserName", "WrongPassword");

            Assert.IsNull(u);
        }
    }
}
