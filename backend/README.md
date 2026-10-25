# EcomStore: 3-Tier E-Commerce App on AWS

A full-stack e-commerce application built to practice real-world DevOps and AWS architecture: containerization, CI/CD, networking, security and monitoring.

## Tech Stack
- **Frontend:** React (Vite), React Router, Axios, served by Nginx
- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Spring Data JPA
- **Database:** MySQL 8
- **DevOps:** Docker, Docker Compose (AWS deployment in progress)

## Features
- User registration and login with JWT authentication
- Role-based access control (USER / ADMIN)
- Product catalog with search and categories
- Shopping cart, checkout and order history
- Admin panel to manage products

## Architecture (local)
```
Browser -> Nginx (React static files, :8081)
              |  /api/*
              v
        Spring Boot API (:8080) -> MySQL (:3306)
```

## Run locally with Docker
Prerequisite: Docker Desktop.

```bash
git clone https://github.com/RajeevKorthiwada2/ecomstore.git
cd ecomstore
docker compose up --build
```
- App: http://localhost:8081
- API: http://localhost:8080

To create an admin, register a user, then in MySQL run:
```sql
INSERT INTO user_roles (user_id, roles) VALUES (<user_id>, 'ROLE_ADMIN');
```

## Roadmap
- [x] Spring Boot REST API with JWT security
- [x] React frontend
- [x] Dockerized (multi-stage builds, docker-compose)
- [ ] AWS networking: VPC, public/private subnets, IGW, route tables
- [ ] RDS MySQL in private subnet
- [ ] Backend on EC2 behind a load balancer
- [ ] Frontend on S3 + CloudFront
- [ ] Security: IAM roles, Security Groups, Secrets Manager, ACM, WAF
- [ ] Route 53 DNS
- [ ] CI/CD with GitHub Actions
- [ ] Monitoring with CloudWatch