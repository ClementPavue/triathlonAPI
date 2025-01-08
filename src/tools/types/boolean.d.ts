declare type falsy = false | 0 | "" | undefined | null; // Should include NaN but typeof NaN is number and we don't want to exclude all the numbers
declare type truthy = Exclude<Primitive, falsy>;
