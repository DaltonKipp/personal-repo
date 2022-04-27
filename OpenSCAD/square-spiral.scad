 // SQUARE SPIRAL
 
 for (i = [0:125])
   {
       angle = i*360/80;
       distance = i*10;
       r = i*30;
       {
       rotate(angle, [i,i,-0.5*i])
       translate([0, 1*distance, 5*distance])
       cube(r);
//        translate([0.1*distance, 0.1*distance, 0.1*distance])
//        rotate(angle, [0, 0.1*i, 0])
//        cube(10,10,10);
        
//        rotate(angle, [1, -i, 1])
//        translate([0, distance, 0])
//        sphere(r);
           

    }
}