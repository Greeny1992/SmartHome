namespace Context.DAL.Data
{
    public abstract class DataPointVisual : MongoDocument
    {
        public String Name { get; set; }
        public String Description { get; set; }
        public String Icon { get; set; }

    }
}
