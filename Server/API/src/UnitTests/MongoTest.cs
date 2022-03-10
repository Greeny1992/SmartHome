using Context.DAL.Data;
using NUnit.Framework;
using System.Threading.Tasks;

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
    }
}
