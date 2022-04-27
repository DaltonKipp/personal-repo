 for (i = [10:100])
   {
       angle = i*360/45;
       distance = i*10;
       r = i*25;
       {
       rotate(angle, [i,0,0])
       translate([0, 0, 5*distance])
       cube(r);         

//        translate([0.1*distance, 0.1*distance, 0.1*distance])
//        rotate(angle, [0, 0.1*i, 0])
//        cube(10,10,10);
        
//        rotate(angle, [1, -i, 1])
//        translate([0, distance, 0])
//        sphere(r);
           

    }
}