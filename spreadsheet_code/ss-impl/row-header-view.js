var RowHeaderView = {};

RowHeaderView.make = function(i) {
    return (Exp.unparseRowNum(i) + "");
};
