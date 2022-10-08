import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_service/auth-service/authentication.service';

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: ['./register-verify.component.css']
})
export class RegisterVerifyComponent implements OnInit {
  success!:boolean;
  code:string='';
  constructor(private auth:AuthenticationService,private route:ActivatedRoute, private router:Router) { }

   ngOnInit() {
    this.code = this.route.snapshot.paramMap.get('code')!;
    if(this.code){
       this.registerVerify(this.code);
    }
  }
  
   registerVerify(code:string){
     this.auth.registerVeryfy(code).subscribe((res:any)=>{
      if(res.success){
        this.success=true;
      } else this.success=false;
    })
  }

  login(){
  this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
    }
}