using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Context.DAL
{
    public class User : MongoDocument
    {
        public string UserName { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }

        [BsonIgnore]
        public string FullName
        {
            get
            {
                return Firstname + " " + Lastname;
            }
        }

        [BsonRepresentation(BsonType.String)]
        [JsonConverter(typeof(StringEnumConverter))]
        public Role Role { get; set; }

        [BsonIgnore]
        public string Password { get; set; }
        public string HashedPassword { get; set; }
        public DateTime ValidTill { get; set; }

    }

    public enum Role
    {
        Admin,
        User
    }



}
