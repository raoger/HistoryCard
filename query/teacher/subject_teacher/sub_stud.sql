--2ND QUERY RUN IN  DATABASE RETURNED FROM 1st query(i.e Batch Database)
SELECT "RRN","STUDENT_NAME"
FROM "TEACHING" LEFT OUTER JOIN "STUDENT" USING("RRN")
WHERE "FACULTY_ID"= $1 AND"SUBJECT_CODE"= $2;