namespace Context.DAL.Data
{
    public class DataPointVisual : MongoDocument
    {
        public String Name { get; set; }
        public String Description { get; set; }
        public String Icon { get; set; }

    }
}
