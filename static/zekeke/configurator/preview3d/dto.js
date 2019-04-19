var Zakeke;
(function (Zakeke) {
    var Preview3D;
    (function (Preview3D) {
        var DTO;
        (function (DTO) {
            // Model DTO
            var ModelDTO = /** @class */ (function () {
                function ModelDTO() {
                    this.parts = [];
                }
                return ModelDTO;
            }());
            DTO.ModelDTO = ModelDTO;
            // Part DTO
            var PartDTO = /** @class */ (function () {
                function PartDTO() {
                    this.colors = [];
                }
                return PartDTO;
            }());
            DTO.PartDTO = PartDTO;
            // Part Color DTO
            var PartColorDTO = /** @class */ (function () {
                function PartColorDTO() {
                }
                return PartColorDTO;
            }());
            DTO.PartColorDTO = PartColorDTO;
        })(DTO = Preview3D.DTO || (Preview3D.DTO = {}));
    })(Preview3D = Zakeke.Preview3D || (Zakeke.Preview3D = {}));
})(Zakeke || (Zakeke = {}));
